#!/usr/bin/env node

import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getProjectStructure } from "./agents/graphAgent.js";
import { localMcpClientCodeAnalyser } from "./agents/codeAnalyzerAgent.js";
import {
  getProjectDescription,
  Metadata,
} from "./agents/projectDescriberAgent.js";
import { projectInfoCollector } from "./services/projectInfoCollector.js";
import { userInfoCollector } from "./services/userInfoCollector.js";
import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import { execSync } from "child_process";
import {
  codeAnalyzerAgentResponse,
  describerAgentResponse,
  graphAgentResponse,
} from "./mocks/llmResponses.js";
import "dotenv/config";
import { select } from "@inquirer/prompts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "dist", "data.json");

const describerAgentRunnable = RunnableLambda.from(async (uri: string) => {
  console.info(
    "\x1b[34m%s\x1b[0m",
    "Agent 1: Analyzing and Describing the Project..."
  );
  if (process.env.NODE_ENV === "development")
    return { uri, metadata: describerAgentResponse };

  const metadata = await getProjectDescription(uri);
  return { uri, metadata };
});

const codeAnalyzerAgentRunnable = RunnableLambda.from(
  async (args: { uri: string; metadata: Metadata }) => {
    console.info(
      "\x1b[34m%s\x1b[0m",
      "Agent 2: Loading and Analyzing File Content..."
    );
    if (process.env.NODE_ENV === "development")
      return {
        data: codeAnalyzerAgentResponse,
        metadata: describerAgentResponse,
      };

    const data = await localMcpClientCodeAnalyser(args.uri, args.metadata);
    return { data: data, metadata: args.metadata };
  }
);

const graphAgentRunnable = RunnableLambda.from(
  async (agrs: { data: string; metadata: Metadata }) => {
    console.info(
      "\x1b[34m%s\x1b[0m",
      "Agent 3: Generating the Project Graph..."
    );
    if (process.env.NODE_ENV === "development")
      return {
        graph: JSON.stringify(graphAgentResponse),
        metadata: describerAgentResponse,
      };

    const graph = await getProjectStructure(agrs.data);
    return { graph: graph, metadata: agrs.metadata };
  }
);

const pipeline = RunnableSequence.from([
  describerAgentRunnable,
  codeAnalyzerAgentRunnable,
  graphAgentRunnable,
]);

async function main() {
  const option = await select({
    message: "Select an option!",
    choices: ["Analyze Project", "Run Web Server"],
  });

  if (option === "Analyze Project") {
    await userInfoCollector();

    const { env, uri } = await projectInfoCollector();

    if (env !== "Local") {
      console.error("Feature is not yet available! Sorry!");
      process.exit(0);
    }

    const response = await pipeline.invoke(uri);

    console.info("Launching the FlowGraph UI...");

    if (process.env.NODE_ENV === "development") {
      console.log("Building Client UI...");
      execSync("npm run build", { cwd: path.join(__dirname, "client") });
    }

    console.log("Preparing Data...");
    writeFileSync(
      publicPath,
      JSON.stringify(
        { metadata: response.metadata, graph: JSON.parse(response.graph) },
        null,
        2
      )
    );
  }

  console.log(
    "\x1b[32m%s\x1b[0m",
    "FlowAnalyzer Server Running on: http://localhost:3001"
  );

  execSync("npm run start", { cwd: path.join(__dirname, "api") });
}

main();
