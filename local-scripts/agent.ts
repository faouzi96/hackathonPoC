import { minimatch } from "minimatch";
import { createAzure } from "@ai-sdk/azure";
import { Client } from "@modelcontextprotocol/sdk/client";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import "dotenv/config";
import { generateText, jsonSchema, ModelMessage, tool } from "ai";
import { readdir } from "fs/promises";
import { input } from "@inquirer/prompts";
import { join, resolve } from "path";
import { systemMessage } from "../globals/systemMessage";

const mcpClient = new Client(
  {
    name: "github-mcp-client",
    version: "1.0.0",
  },
  {
    capabilities: {
      sampling: {},
    },
    enforceStrictCapabilities: true,
  }
);

const azure = createAzure({
  apiKey: process.env.AZURE_AI_KEY,
  apiVersion: process.env.AZURE_AI_API_VERSION,
  baseURL: process.env.AZURE_AI_ENDPOINT,
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

const transport = new StdioClientTransport({
  command: "npm",
  args: ["run", "mcp:server:dev"],
  stderr: "ignore",
});

async function queryProcessing(query: ModelMessage[], tools: Tool[]) {
  const messages: ModelMessage[] = [...query];

  const response = await generateText({
    model: azure("gpt-4.5-mini"),
    prompt: messages,
    tools: tools.reduce(
      (obj, t) => ({
        ...obj,
        [t.name]: tool({
          description: t.description,
          inputSchema: jsonSchema(t.inputSchema),
          execute: async (args: Record<string, any>) => {
            return await mcpClient.callTool({
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

      const result = await mcpClient.callTool({
        name: toolName,
        arguments: toolArgs,
      });

      console.log(
        `[Calling tool ${toolName} with arguments: ${toolArgs?.path}]`
      );

      messages.push({
        role: "user",
        content: result.content as string,
      });
    }
  }

  const finalResponse = await generateText({
    model: azure("gpt-4.5-mini"),
    messages: messages,
    maxOutputTokens: 1000,
  });

  finalText.push(
    finalResponse.content[0].type === "text"
      ? finalResponse.content[0].text
      : ""
  );

  return finalText.join("\n");
}

export async function localMcpClient() {
  const ignorePatterns = ["node_modules", ".*", "temp*", ".env"];

  // go through the files load their paths into the context.
  const uri = await input({
    message: "Please insert the absolute path for your project files",
  });

  const files = (await getAllFilePaths(uri, ignorePatterns)).join("\n");
  const fileContext = `\n\nList of the files:
  \n${files}`;

  await mcpClient.connect(transport);

  const { tools } = await mcpClient.listTools();

  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemMessage + fileContext,
    },
  ];

  const response = await queryProcessing(messages, tools);
  mcpClient.close();
  return response;
}
// You need to install this: `npm install minimatch`

async function getAllFilePaths(
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
      if (ignorePatterns.some((pattern) => minimatch(name, pattern))) {
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
