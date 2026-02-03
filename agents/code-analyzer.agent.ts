import { Client } from "@modelcontextprotocol/sdk/client";
import {
  StdioClientTransport,
  StdioServerParameters,
} from "@modelcontextprotocol/sdk/client/stdio.js";
import { Tool } from "@modelcontextprotocol/sdk/types.js";
import {
  SystemMessage,
  HumanMessage,
  AIMessage,
} from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { readdir } from "fs/promises";
import { join, resolve } from "path";
import { LLMService } from "../services/llm.service.js";
import {
  getMcpServerPath,
  systemContentAnalyserMessage,
} from "../utils/index.js";
import { Metadata } from "../types/app.types.js";
import { z } from "zod";

export class CodeAnalyzerAgent {
  private mcpClient: Client;
  private transport: StdioClientTransport;
  private llmService = new LLMService();

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
      },
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

    const systemContent =
      systemContentAnalyserMessage + fileContext + description;

    const response = await this.queryProcessing(systemContent, tools);
    this.mcpClient.close();
    return response;
  }

  private async queryProcessing(systemContent: string, mcpTools: Tool[]) {
    const model = this.llmService.connection();

    // Add null check for model
    if (!model) {
      throw new Error(
        "Failed to establish LLM connection. Model is undefined.",
      );
    }

    // Add null check for bindTools method
    if (!model.bindTools) {
      throw new Error(
        "Model does not support tool binding. Ensure you are using a compatible LLM model.",
      );
    }

    // Convert MCP tools to LangChain tools
    const langchainTools: DynamicStructuredTool[] = mcpTools.map((t) => {
      // Convert JSON schema to Zod schema
      const zodSchema = this.jsonSchemaToZod(t.inputSchema);

      return new DynamicStructuredTool({
        name: t.name,
        description: t.description || "",
        schema: zodSchema,
        func: async (args: Record<string, any>) => {
          const result = await this.mcpClient.callTool({
            name: t.name,
            arguments: args,
          });
          return JSON.stringify(result.content);
        },
      });
    });

    // Bind tools to model
    const modelWithTools = model.bindTools(langchainTools);

    // Initial invocation
    const response = await modelWithTools.invoke([
      new SystemMessage(systemContent),
    ]);

    const finalText: string[] = [];

    // Handle response content
    if (typeof response.content === "string") {
      finalText.push(response.content);
    }

    // Handle tool calls if present
    if (response.additional_kwargs?.tool_calls) {
      const toolCalls = response.additional_kwargs.tool_calls;

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;
        const toolArgs = JSON.parse(toolCall.function.arguments || "{}");

        const result = await this.mcpClient.callTool({
          name: toolName,
          arguments: toolArgs,
        });

        console.log(
          `[Calling tool ${toolName} with arguments: ${toolArgs?.path}]`,
        );

        // Create follow-up messages with tool results
        const followUpResponse = await model.invoke([
          new SystemMessage(systemContent),
          new HumanMessage(
            `[Calling tool ${toolName} with arguments: ${toolArgs?.path}]`,
          ),
          new HumanMessage(JSON.stringify(result.content)),
        ]);

        if (typeof followUpResponse.content === "string") {
          finalText.push(followUpResponse.content);
        }
      }
    }

    return finalText.join("\n");
  }

  // JSON Schema to Zod schema
  private jsonSchemaToZod(schema: any): z.ZodType<any> {
    if (!schema || typeof schema !== "object") {
      return z.any();
    }

    if (schema.type === "object") {
      const shape: Record<string, z.ZodType<any>> = {};

      if (schema.properties) {
        for (const [key, value] of Object.entries(schema.properties)) {
          shape[key] = this.jsonSchemaToZod(value);
        }
      }

      return z.object(shape);
    }

    if (schema.type === "string") {
      return z.string();
    }

    if (schema.type === "number" || schema.type === "integer") {
      return z.number();
    }

    if (schema.type === "boolean") {
      return z.boolean();
    }

    if (schema.type === "array") {
      return z.array(this.jsonSchemaToZod(schema.items));
    }

    return z.any();
  }

  private async getAllFilePaths(
    folderPath: string,
    ignorePatterns: string[] = [],
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
