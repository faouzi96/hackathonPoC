import { input, select } from "@inquirer/prompts";
import { exec } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getProjectStructure } from "./local-scripts/agent";
import { localMcpClientCodeAnalyser } from "./local-scripts/codeAnalyzerAgent";
import { getProjectDescription } from "./local-scripts/projectDescriberAgent";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "public", "data.json");

async function main() {
  const env = await select({
    message: "Choose your project environment!",
    choices: ["Local", "Github (not ready)"],
  });

  // go through the files load their paths into the context.
  const uri = await input({
    message: "Please insert the absolute path for your project files",
  });

  const description = await getProjectDescription(uri);

  let data: string = "";
  let response: string = "";
  if (env === "Local")
    data = await localMcpClientCodeAnalyser(uri, description?.ignorePatterns);
  //  if (env === "Github")

  if (data) response = await getProjectStructure(data);

  writeFileSync(
    publicPath,
    JSON.stringify(
      { metadata: description, graph: JSON.parse(response) },
      null,
      2
    )
  );

  console.log("UI Development Server Running on: http://localhost:3000");
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
