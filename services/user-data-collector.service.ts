import { confirm, input, select } from "@inquirer/prompts";
import { LMM_CONNECTION_PARAMS } from "../utils/index.js";
import { UserInfo } from "../types/app.types.js";
import { StorageService } from "./storage.service.js";
import { GitService } from "./git.service.js";

type Environment = "Local" | "Github (not ready)";

export class UserDataCollectorService {
  private storageService: StorageService = new StorageService();
  private gitService: GitService = new GitService();

  public async collect(): Promise<{
    env: Environment;
    uri: string;
  }> {
    const provider: string = await select({
      message: "Select your LLM Provider!",
      choices: ["OpenAI", "Azure", "Google", "Anthropic", "Ollama"],
    });

    this.storageService.saveUserInfo("PROVIDER", provider);

    if (!this.checkUserInfoExists()) {
      console.log(
        "User information is incomplete. Please provide the missing information."
      );
      await this.collectProviderData(provider);
    } else {
      console.log("All required user information are already provided.");
      const confirmation = await confirm({
        message: "Do you want to update your information?",
        default: false,
      });
      if (confirmation) {
        await this.collectProviderData(provider);
      }
    }

    return this.collectProjectInfo();
  }

  private async collectProjectInfo(): Promise<{
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
        uri = await this.gitService.clone(uri);
      }
      return { env, uri };
    } catch (error) {
      console.error("Error collecting project information:", error);
      process.exit(0);
    }
  }

  private checkUserInfoExists(): boolean {
    const provider = this.storageService.getUserInfo("PROVIDER");
    const requiredKeys: UserInfo[] = LMM_CONNECTION_PARAMS.filter((key) =>
      key.includes(provider.toUpperCase())
    ) as UserInfo[];

    for (const key of requiredKeys) {
      if (!this.storageService.getUserInfo(key)) {
        return false;
      }
    }
    return true;
  }

  private async collectProviderData(provider: string) {
    try {
      switch (provider) {
        case "Azure": {
          const baseURL = await input({
            message:
              "Enter your Azure OpenAI Endpoint (e.g., https://your-resource.openai.azure.com/):",
          });
          this.storageService.saveUserInfo("AZURE_AI_ENDPOINT", baseURL);

          const apiKey = await input({
            message: "Enter your Azure OpenAI API Key:",
          });
          this.storageService.saveUserInfo("AZURE_AI_KEY", apiKey);

          const apiVersion = await input({
            message:
              "Enter your Azure OpenAI API Version (e.g., 2024-02-15-preview):",
          });
          this.storageService.saveUserInfo("AZURE_AI_API_VERSION", apiVersion);

          const resourceName = await input({
            message: "Enter your Azure Resource Name:",
          });
          this.storageService.saveUserInfo("AZURE_RESOURCE_NAME", resourceName);

          const model = await input({
            message: "Enter your Azure Model Name:",
          });
          this.storageService.saveUserInfo("AZURE_MODEL_NAME", model);
          break;
        }
        case "Google": {
          const baseURL = await input({
            message:
              "[Optional] Enter your Gemini Endpoint (default: https://generativelanguage.googleapis.com/v1beta/models/):",
          });
          this.storageService.saveUserInfo(
            "GOOGLE_BASE_URL",
            baseURL ?? "undefined"
          );

          const apiKey = await input({
            message: "Enter your Gemini API Key:",
          });
          this.storageService.saveUserInfo("GOOGLE_API_KEY", apiKey);

          const model = await input({
            message: "Enter your Gemini model name:",
          });
          this.storageService.saveUserInfo("GOOGLE_MODEL_NAME", model);
          break;
        }
        case "Ollama": {
          const baseURL = await input({
            message:
              "[Optional] Enter your Ollama Endpoint (default: http://localhost:11434/api):",
          });
          this.storageService.saveUserInfo(
            "OLLAMA_BASE_URL",
            baseURL ?? "undefined"
          );

          const apiKey = await input({
            message:
              "[Optional] Enter your Ollama API Key / Authorization Header:",
          });
          this.storageService.saveUserInfo(
            "OLLAMA_API_KEY",
            apiKey ?? "undefined"
          );

          const model = await input({
            message: "Enter your Ollama model name:",
          });
          this.storageService.saveUserInfo("OLLAMA_MODEL_NAME", model);
          break;
        }
        case "Anthropic": {
          const baseURL = await input({
            message:
              "[Optional] Enter your Anthropic Endpoint (default: https://api.anthropic.com/v1):",
          });
          this.storageService.saveUserInfo(
            "ANTHROPIC_BASE_URL",
            baseURL ?? "undefined"
          );

          const apiKey = await input({
            message: "[Optional] Enter your Anthropic API Key:",
          });
          this.storageService.saveUserInfo("ANTHROPIC_API_KEY", apiKey);

          const model = await input({
            message: "Enter your Anthropic model name:",
          });
          this.storageService.saveUserInfo("ANTHROPIC_MODEL_NAME", model);
          break;
        }
        case "OpenAI": {
          const baseURL = await input({
            message:
              "[Optional] Enter your OpenAI Endpoint (default: https://api.openai.com/v1):",
          });
          this.storageService.saveUserInfo(
            "OPENAI_BASE_URL",
            baseURL ?? "undefined"
          );

          const apiKey = await input({
            message: "[Optional] Enter your OpenAI API Key:",
          });
          this.storageService.saveUserInfo("OPENAI_API_KEY", apiKey);

          const model = await input({
            message: "Enter your OpenAI model name:",
          });
          this.storageService.saveUserInfo("OPENAI_MODEL_NAME", model);
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
}
