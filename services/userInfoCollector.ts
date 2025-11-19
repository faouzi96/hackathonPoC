import { confirm, input, select } from "@inquirer/prompts";
import { LocalStorage } from "node-localstorage";

const localStorage = new LocalStorage("./creds");

type UserInfo =
  | "AZURE_AI_ENDPOINT"
  | "AZURE_AI_KEY"
  | "AZURE_AI_API_VERSION"
  | "AZURE_RESOURCE_NAME"
  | "AZURE_MODEL_NAME"
  | "OPENAI_BASE_URL"
  | "OPENAI_API_KEY"
  | "OPENAI_MODEL_NAME"
  | "ANTHROPIC_BASE_URL"
  | "ANTHROPIC_API_KEY"
  | "ANTHROPIC_MODEL_NAME"
  | "GOOGLE_BASE_URL"
  | "GOOGLE_API_KEY"
  | "GOOGLE_MODEL_NAME"
  | "OLLAMA_BASE_URL"
  | "OLLAMA_API_KEY"
  | "OLLAMA_MODEL_NAME"
  | "VLLM_BASE_URL"
  | "VLLM_MODEL_NAME"
  | "VLLM_API_KEY";

export function saveUserInfo(key: UserInfo, value: string): void {
  localStorage.setItem(key, value);
}

export function getUserInfo(key: UserInfo): string {
  return localStorage.getItem(key) || "";
}

async function collectInfo() {
  try {
    const provider = await select({
      message: "Select your LLM Provider!",
      choices: ["Azure OpenAI", "Others (not ready)"],
    });

    if (provider === "Azure OpenAI") {
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
    } else {
      console.error("Feature is not yet available! Sorry!");
      process.exit(0);
    }
  } catch (error) {
    console.error("Error collecting user information:", error);
    process.exit(1);
  }
}

function checkUserInfoExists(): boolean {
  const requiredKeys: UserInfo[] = [
    "AZURE_AI_ENDPOINT",
    "AZURE_AI_KEY",
    "AZURE_AI_API_VERSION",
    "AZURE_RESOURCE_NAME",
    "AZURE_MODEL_NAME",
  ];
  for (const key of requiredKeys) {
    if (!getUserInfo(key)) {
      return false;
    }
  }
  return true;
}

export async function userInfoCollector(): Promise<void> {
  if (!checkUserInfoExists()) {
    console.log(
      "User information is incomplete. Please provide the missing information."
    );
    await collectInfo();
  } else {
    console.log("All required user information is already provided.");
    const confirmation = await confirm({
      message: "Do you want to update your information?",
      default: false,
    });
    if (confirmation) {
      await collectInfo();
    }
  }
}
