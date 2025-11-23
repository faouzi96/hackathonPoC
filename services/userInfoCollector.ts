import { confirm, input, select } from "@inquirer/prompts";
import { LocalStorage } from "node-localstorage";
import { LMM_CONNECTION_PARAMS } from "../utils/constants.js";
import { UserInfo } from "../types/app.types.js";

const localStorage = new LocalStorage("./creds");

export function saveUserInfo(key: UserInfo, value: string): void {
  localStorage.setItem(key, value);
}

export function getUserInfo(key: UserInfo): string {
  return localStorage.getItem(key) || "";
}

async function collectInfo(provider: string) {
  try {
    switch (provider) {
      case "Azure": {
        const baseURL = await input({
          message:
            "Enter your Azure OpenAI Endpoint (e.g., https://your-resource.openai.azure.com/):",
        });
        saveUserInfo("AZURE_AI_ENDPOINT", baseURL);

        const apiKey = await input({
          message: "Enter your Azure OpenAI API Key:",
        });
        saveUserInfo("AZURE_AI_KEY", apiKey);

        const apiVersion = await input({
          message:
            "Enter your Azure OpenAI API Version (e.g., 2024-02-15-preview):",
        });
        saveUserInfo("AZURE_AI_API_VERSION", apiVersion);

        const resourceName = await input({
          message: "Enter your Azure Resource Name:",
        });
        saveUserInfo("AZURE_RESOURCE_NAME", resourceName);

        const model = await input({
          message: "Enter your Azure Model Name:",
        });
        saveUserInfo("AZURE_MODEL_NAME", model);
        break;
      }
      case "Google": {
        const baseURL = await input({
          message:
            "[Optional] Enter your Gemini Endpoint (e.g., https://generativelanguage.googleapis.com/v1beta/models/):",
        });
        saveUserInfo("GOOGLE_BASE_URL", baseURL ?? "undefined");

        const apiKey = await input({
          message: "Enter your Gemini API Key:",
        });
        saveUserInfo("GOOGLE_API_KEY", apiKey);

        const model = await input({
          message: "Enter your Gemini model name:",
        });
        saveUserInfo("GOOGLE_MODEL_NAME", model);
        break;
      }
      case "Ollama":
        const baseURL = await input({
          message:
            "[Optional] Enter your Ollama Endpoint (e.g., http://localhost:11434):",
        });
        saveUserInfo("OLLAMA_BASE_URL", baseURL ?? "undefined");

        const apiKey = await input({
          message: "[Optional] Enter your Ollama API Key / Authorization Header:",
        });
        saveUserInfo("OLLAMA_API_KEY", apiKey ?? "undefined");

        const model = await input({
          message: "Enter your Ollama model name:",
        });
        saveUserInfo("OLLAMA_MODEL_NAME", model);
        break;

      default: {
        console.error("Feature is not yet available! Sorry!");
        process.exit(0);
      }
    }
  } catch (error) {
    console.error("Error collecting user information:", error);
    process.exit(1);
  }
}

function checkUserInfoExists(): boolean {
  const provider = getUserInfo("PROVIDER");
  const requiredKeys: UserInfo[] = LMM_CONNECTION_PARAMS.filter((key) =>
    key.includes(provider.toUpperCase()),
  ) as UserInfo[];

  for (const key of requiredKeys) {
    if (!getUserInfo(key)) {
      return false;
    }
  }
  return true;
}

export async function userInfoCollector(): Promise<void> {
  const provider: string = await select({
    message: "Select your LLM Provider!",
    choices: ["Azure", "Google", "Ollama", "Others (not ready)"],
  });

  if (provider !== "Others (not ready)") saveUserInfo("PROVIDER", provider);

  if (!checkUserInfoExists()) {
    console.log(
      "User information is incomplete. Please provide the missing information.",
    );
    await collectInfo(provider);
  } else {
    console.log("All required user information are already provided.");
    const confirmation = await confirm({
      message: "Do you want to update your information?",
      default: false,
    });
    if (confirmation) {
      await collectInfo(provider);
    }
  }
}
