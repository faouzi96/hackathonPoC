import { Client } from "@modelcontextprotocol/sdk/client";
import {
  StdioClientTransport,
  StdioServerParameters,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { generateText, jsonSchema, ModelMessage, tool } from "ai";
import { readdir } from "fs/promises";
import path, { join, resolve } from "path";
import { systemContentAnalyserMessage } from "../utils/systemMessage.js";
import { Metadata } from "./projectDescriberAgent.js";
import { llmConnection } from "../globals/llmConnection.js";
import getMcpServerPath from "../utils/getMcpServerPath.js";

export class CodeAnalyzerAgent {
  private mcpClient: Client;
  private transport: StdioClientTransport;

  constructor() {
    const mcpServerPath = getMcpServerPath();
    const transportConfig: StdioServerParameters =
      process.env.NODE_ENV === "development"
        ? {
            command: "npm",
            args: ["run", "mcp:server:dev"],
            stderr: "ignore",
          }
        : {
            command: "node",
            args: [mcpServerPath],
            stderr: "inherit",
          };
    this.mcpClient = new Client(
      {
        name: "file-reader-mcp-client",
        version: "1.0.0",
      },
      {
        capabilities: {
          sampling: {},
        },
        enforceStrictCapabilities: true,
      }
    );
    this.transport = new StdioClientTransport(transportConfig);
  }

  public async localMcpClientCodeAnalyser(uri: string, metadata: Metadata) {
    const files = (
      await this.getAllFilePaths(uri, metadata.ignorePatterns)
    ).join("\n");
    const fileContext = `\n\nList of the files:
  \n${files}`;

    const description = `\nConsider the following project description given by analyzing the project files:
\n ${metadata.description}`;

    await this.mcpClient.connect(this.transport);

    const { tools } = await this.mcpClient.listTools();

    const messages: ModelMessage[] = [
      {
        role: "system",
        content: systemContentAnalyserMessage + fileContext + description,
      },
    ];

    const response = await this.queryProcessing(messages, tools);
    this.mcpClient.close();
    return response;
  }

  private async queryProcessing(query: ModelMessage[], tools: Tool[]) {
    const messages: ModelMessage[] = [...query];

    const response = await generateText({
      model: llmConnection(),
      prompt: JSON.stringify(messages),
      tools: tools.reduce(
        (obj, t) => ({
          ...obj,
          [t.name]: tool({
            description: t.description,
            inputSchema: jsonSchema(t.inputSchema),
            execute: async (args: Record<string, any>) => {
              return await this.mcpClient.callTool({
                name: t.name,
                arguments: args,
              });
            },
          }),
        }),
        {}
      ),
    });

    const finalText = [];

    for (const content of response.content) {
      if (content.type === "text") {
        finalText.push(content.text);
      } else if (content.type === "tool-call") {
        const toolName = content.toolName;
        const toolArgs = content.input as { [x: string]: unknown } | undefined;

        const result = await this.mcpClient.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        console.log(
          `[Calling tool ${toolName} with arguments: ${toolArgs?.path}]`
        );
        const newMessages: ModelMessage[] = [
          ...messages,
          {
            role: "user",
            content: `[Calling tool ${toolName} with arguments: ${toolArgs?.path}]`,
          },
          {
            role: "user",
            content: result.content as string,
          },
        ];

        const finalResponse = await generateText({
          model: llmConnection(),
          prompt: JSON.stringify(newMessages),
          maxOutputTokens: 1000,
        });

        finalText.push(
          finalResponse.content[0].type === "text"
            ? finalResponse.content[0].text
            : ""
        );
      }
    }

    return finalText.join("\n");
  }

  private async getAllFilePaths(
    folderPath: string,
    ignorePatterns: string[] = []
  ) {
    const result: string[] = [];

    async function walk(currentPath: string) {
      const entries = await readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const name = entry.name;
        const fullPath = join(currentPath, name);

        // Skip hidden files/folders and user-defined patterns
        if (
          ignorePatterns.some((pattern) => {
            // Check if the full path or just the name matches any ignore pattern
            return fullPath.includes(pattern.replace("/", "").replace('"', ""));
          })
        ) {
          continue;
        }

        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.isFile()) {
          result.push(resolve(fullPath));
        }
      }
    }

    await walk(resolve(folderPath));
    return result;
  }
}
