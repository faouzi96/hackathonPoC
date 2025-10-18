import { exec } from "child_process";
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
import { server } from "./services/server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "public", "data.json");

const describerAgentRunnable = RunnableLambda.from(async (uri: string) => {
  console.info(
    "\x1b[34m%s\x1b[0m",
    "Agent 1: Analyzing and Describing the Project..."
  );
  const metadata = await getProjectDescription(uri);
  return { uri, metadata };
});

const codeAnalyzerAgentRunnable = RunnableLambda.from(
  async (args: { uri: string; metadata: Metadata }) => {
    console.info(
      "\x1b[34m%s\x1b[0m",
      "Agent 2: Loading and Analyzing File Content..."
    );
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
  await userInfoCollector();

  const { env, uri } = await projectInfoCollector();

  if (env !== "Local") {
    console.error("Feature is not yet available! Sorry!");
    process.exit(0);
  }

  const response = await pipeline.invoke(uri);

  console.info("Launching the FlowGraph UI...");
  writeFileSync(
    publicPath,
    JSON.stringify(
      { metadata: response.metadata, graph: JSON.parse(response.graph) },
      null,
      2
    )
  );

  console.log(
    "\x1b[32m%s\x1b[0m",
    "FlowGraph UI Development Server Running on:"
  );

  exec(
    "npm run build",
    { cwd: path.join(__dirname, "client") },
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Failed to start React app:", err);
        return;
      }
    }
  );

  const PORT = 3001;
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();
