#!/usr/bin/env node

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import "dotenv/config";
import { select } from "@inquirer/prompts";
import { UserDataCollectorService } from "./services/user-data-collector.service.js";
import { GitService } from "./services/git.service.js";
import { parseLlmResponse } from "./utils/index.js";
import { LangchainService } from "./services/langchain.service.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "dist", "data.json");

async function main() {
  console.log(`
    _______ _               _                _                     
   |  ___| |             / \\              | |                    
   | |_  | | _____      _/ _ \\ _ __   __ _| |_   _ _______ _ __ 
   |  _| | |/ _ \\ \\ /\\ / / ___ \\ '_ \\ / _\` | | | | |_  / _ \\ '__|
   | |   | | (_) \\ V  V / /   \\ \\ | | (_| | | |_| |/ /  __/ |   
   \\_|   |_|\\___/ \\_/\\_/_/     \\_\\_|\\__,_|_|\\__, /___\\___|_|   
                                              __/ |              
                                             |___/               
    Welcome!
  `);

  const userInfoCollectorService = new UserDataCollectorService();
  const gitService = new GitService();

  if (process.env.NODE_ENV === "development") {
    console.log("🛠️  Building Client UI...");
    execSync("npm run build", { cwd: path.join(__dirname, "client") });
    console.log("🛠️  Building Server App...");
    execSync("npm run build", { cwd: path.join(__dirname, "api") });
  }

  const option = await select({
    message: "Select an option!",
    choices: ["Analyze Project", "Run Web Server"],
  });

  if (option === "Analyze Project") {
    const { env, uri } = await userInfoCollectorService.collect();

    const response = await LangchainService.pipeline().invoke(uri);

    if (env !== "Local") {
      console.info("🧹 Cleaning up cloned repository...");
      await gitService.delete(uri);
    }

    console.info("🚀 Launching the FlowGraph UI...");

    console.log("📦 Preparing Data...");
    writeFileSync(
      publicPath,
      JSON.stringify(
        {
          metadata: response.metadata,
          graph: parseLlmResponse(response.graph),
        },
        null,
        2,
      ),
    );
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    "🌐 FlowAnalyzer Server Running on: http://localhost:3001",
  );

  execSync("npm run start:prod", { cwd: path.join(__dirname, "api") });
}

main();
