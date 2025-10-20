import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import z from "zod";

import { readFile } from "fs/promises";

const server = new McpServer({
  name: "local-project-inspector",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
    prompts: {},
  },
});

server.tool(
  "get-file-content",
  "Returns the content of a file for a specific path",
  {
    path: z.string(),
  },
  {
    title: "Return a file content",
    idempotentHint: false,
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async (params): Promise<CallToolResult> => {
    try {
      const content = await loadFileContent(params.path);
      return {
        content: [
          {
            type: "text",
            text: content ?? "Error loading the file",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Server Error!`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();

async function loadFileContent(path: string) {
  try {
    const content = await readFile(path, "utf-8");
    return content;
  } catch (err) {
    console.error(`Failed to read file at ${path}:`, err);
    return null;
  }
}
