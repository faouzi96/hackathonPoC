import { input, select } from "@inquirer/prompts";
import { exec } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { localMcpClient } from "./local-scripts/agent";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicPath = path.join(__dirname, "client", "public", "data.json");

async function main() {
  const env = await select({
    message: "Choose your project environment!",
    choices: ["Local", "Github"],
  });

  let response: string = "";

  if (env === "Local") response = await localMcpClient();
  //  if (env === "Github")

  writeFileSync(publicPath, JSON.stringify(JSON.parse(response), null, 2));

  exec(
    "npm run dev",
    { cwd: path.join(__dirname, "client") },
    (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Failed to start React app:", err);
        return;
      }
      console.log("UI Development Server Running on: http://localhost:3000");
    }
  );
}

main();
