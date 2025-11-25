import { confirm, input, select } from "@inquirer/prompts";
import { LocalStorage } from "node-localstorage";
import { LMM_CONNECTION_PARAMS } from "../utils/constants.js";
import { UserInfo } from "../types/app.types.js";
import path from "path";
import { homedir } from "os";
import fs from "fs-extra";

const storagePath = path.join(homedir(), ".flow-analyzer-creds");
if (!fs.existsSync(storagePath)) {
  fs.mkdirSync(storagePath, { recursive: true });
}

// Use OS temp directory or a custom folder
const localStorage = new LocalStorage(storagePath);

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
            "[Optional] Enter your Gemini Endpoint (default: https://generativelanguage.googleapis.com/v1beta/models/):",
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
      case "Ollama": {
        const baseURL = await input({
          message:
            "[Optional] Enter your Ollama Endpoint (default: http://localhost:11434/api):",
        });
        saveUserInfo("OLLAMA_BASE_URL", baseURL ?? "undefined");

        const apiKey = await input({
          message:
            "[Optional] Enter your Ollama API Key / Authorization Header:",
        });
        saveUserInfo("OLLAMA_API_KEY", apiKey ?? "undefined");

        const model = await input({
          message: "Enter your Ollama model name:",
        });
        saveUserInfo("OLLAMA_MODEL_NAME", model);
        break;
      }
      case "Anthropic": {
        const baseURL = await input({
          message:
            "[Optional] Enter your Anthropic Endpoint (default: https://api.anthropic.com/v1):",
        });
        saveUserInfo("ANTHROPIC_BASE_URL", baseURL ?? "undefined");

        const apiKey = await input({
          message: "[Optional] Enter your Anthropic API Key:",
        });
        saveUserInfo("ANTHROPIC_API_KEY", apiKey);

        const model = await input({
          message: "Enter your Anthropic model name:",
        });
        saveUserInfo("ANTHROPIC_MODEL_NAME", model);
        break;
      }
      case "OpenAI": {
        const baseURL = await input({
          message:
            "[Optional] Enter your OpenAI Endpoint (default: https://api.openai.com/v1):",
        });
        saveUserInfo("OPENAI_BASE_URL", baseURL ?? "undefined");

        const apiKey = await input({
          message: "[Optional] Enter your OpenAI API Key:",
        });
        saveUserInfo("OPENAI_API_KEY", apiKey);

        const model = await input({
          message: "Enter your OpenAI model name:",
        });
        saveUserInfo("OPENAI_MODEL_NAME", model);
        break;
      }
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
    key.includes(provider.toUpperCase())
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
    choices: ["OpenAI", "Azure", "Google", "Anthropic", "Ollama"],
  });

  saveUserInfo("PROVIDER", provider);

  if (!checkUserInfoExists()) {
    console.log(
      "User information is incomplete. Please provide the missing information."
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
