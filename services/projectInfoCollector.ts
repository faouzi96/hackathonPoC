import { input, select } from "@inquirer/prompts";

type Environment = "Local" | "Github (not ready)";

export async function projectInfoCollector(): Promise<{
  env: Environment;
  uri: string;
}> {
  try {
    const env: Environment = await select({
      message: "Choose your project environment!",
      choices: ["Local", "Github (not ready)"],
    });

    const uri = await input({
      message: "Please insert the absolute path for your project files",
    });
    return { env, uri };
  } catch (error) {
    console.error("Error collecting project information:", error);
    process.exit(0);
  }
}
