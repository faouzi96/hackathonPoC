import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";

export const getMcpServerPath = () => {
  try {
    const globalRoot = execSync("npm root", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    const localPath = path.resolve(
      globalRoot,
      "flow-analyzer",
      "mcp-servers",
      "mcp-server.js"
    );

    if (fs.existsSync(localPath)) return localPath;
    else {
      const globalRoot = execSync("npm root -g", {
        stdio: ["ignore", "pipe", "ignore"],
      })
        .toString()
        .trim();

      const mcpPath = path.resolve(
        globalRoot,
        "flow-analyzer",
        "mcp-servers",
        "mcp-server.js"
      );
      if (fs.existsSync(mcpPath))
        // need to check the presence of the file
        return mcpPath;
    }
    throw new Error("MCP server not found");
  } catch {
    throw new Error("MCP server not found or failed to find it");
  }
};
