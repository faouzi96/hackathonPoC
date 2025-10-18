import { exec } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getProjectStructure } from "./local-scripts/graphAgent.js";
import { localMcpClientCodeAnalyser } from "./local-scripts/codeAnalyzerAgent.js";
import {
  getProjectDescription,
  Metadata,
} from "./local-scripts/projectDescriberAgent.js";
import { projectInfoCollector } from "./globals/projectInfoCollector.js";
import { userInfoCollector } from "./globals/userInfoCollector.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "public", "data.json");

async function main() {
  await userInfoCollector();

  const { env, uri } = await projectInfoCollector();

  let metadata: Metadata | null = null;

  if (env === "Local") {
    console.info(
      "\x1b[34m%s\x1b[0m",
      "Agent 1: Analyzing and Describing the Project..."
    );
    metadata = await getProjectDescription(uri);
  } else {
    console.error("Feature is not yet available! Sorry!");
    process.exit(0);
  }

  let response: string = "";

  console.info(
    "\x1b[34m%s\x1b[0m",
    "Agent 2: Loading and Analyzing File Content..."
  );

  const data = await localMcpClientCodeAnalyser(uri, metadata);

  console.info("\x1b[34m%s\x1b[0m", "Agent 3: Generating the Project Graph...");

  if (data) response = await getProjectStructure(data);

  console.info("Launching the FlowGraph UI...");
  writeFileSync(
    publicPath,
    JSON.stringify({ metadata: metadata, graph: JSON.parse(response) }, null, 2)
  );

  console.log(
    "\x1b[32m%s\x1b[0m",
    "FlowGraph UI Development Server Running on:"
  );

  console.log("URL: http://localhost:3000");

  exec(
    "npm run dev",
    { cwd: path.join(__dirname, "client") },
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Failed to start React app:", err);
        return;
      }
    }
  );
}

main();
