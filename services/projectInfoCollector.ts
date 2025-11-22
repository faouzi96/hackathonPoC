import { input, select } from "@inquirer/prompts";
import { cloneRepo } from "./gitRepoManager.js";

type Environment = "Local" | "Github (not ready)";

export async function projectInfoCollector(): Promise<{
  env: Environment;
  uri: string;
}> {
  try {
    const env: Environment = await select({
      message: "Choose your project environment!",
      choices: ["Local", "Remote Git"],
    });

    let uri = await input({
      message: "Please insert the absolute/full path/url for your project",
    });

    if (env !== "Local") {
      uri = await cloneRepo(uri);
    }
    return { env, uri };
  } catch (error) {
    console.error("Error collecting project information:", error);
    process.exit(0);
  }
}
