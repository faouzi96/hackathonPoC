import { createAzure } from "@ai-sdk/azure";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider-v2";
import { createOpenAI } from "@ai-sdk/openai";
import { LlmProvider } from "../types/app.types.js";
import { StorageService } from "./storage.service.js";

export class LLMService {
  private storageService: StorageService = new StorageService();

  // Default connection (can be switched based on environment)
  public connection() {
    return this.getLlmConnection(
      this.storageService.getUserInfo("PROVIDER") as LlmProvider
    );
  }

  // Method to get LLM connection based on provider name
  private getLlmConnection(provider: LlmProvider) {
    switch (provider) {
      case "Azure":
        return this.azureLlmConnection();
      case "Openai":
        return this.openaiLlmConnection();
      case "Anthropic":
        return this.anthropicLlmConnection();
      case "Google":
        return this.googleLlmConnection();
      case "Ollama":
        return this.ollamaLlmConnection();
      default:
        throw new Error(`Unknown LLM provider: ${provider}`);
    }
  }

  // Azure AI
  private azureLlmConnection() {
    const AZURE_AI_KEY = this.storageService.getUserInfo("AZURE_AI_KEY");
    const AZURE_AI_API_VERSION = this.storageService.getUserInfo(
      "AZURE_AI_API_VERSION"
    );
    const AZURE_AI_ENDPOINT =
      this.storageService.getUserInfo("AZURE_AI_ENDPOINT");
    const AZURE_RESOURCE_NAME = this.storageService.getUserInfo(
      "AZURE_RESOURCE_NAME"
    );
    const AZURE_MODEL_NAME =
      this.storageService.getUserInfo("AZURE_MODEL_NAME");
    return createAzure({
      apiKey: AZURE_AI_KEY,
      apiVersion: AZURE_AI_API_VERSION,
      baseURL: AZURE_AI_ENDPOINT,
      resourceName: AZURE_RESOURCE_NAME,
    })(AZURE_MODEL_NAME);
  }

  // OpenAI
  private openaiLlmConnection() {
    const OPENAI_BASE_URL = this.storageService.getUserInfo("OPENAI_BASE_URL");
    const OPENAI_API_KEY = this.storageService.getUserInfo("OPENAI_API_KEY");
    const OPENAI_MODEL_NAME =
      this.storageService.getUserInfo("OPENAI_MODEL_NAME");
    return OPENAI_BASE_URL !== "undefined"
      ? createOpenAI({
          baseURL: OPENAI_BASE_URL,
          apiKey: OPENAI_API_KEY,
        })(OPENAI_MODEL_NAME)
      : createOpenAI({
          apiKey: OPENAI_API_KEY,
        })(OPENAI_MODEL_NAME);
  }

  // Anthropic
  private anthropicLlmConnection() {
    const ANTHROPIC_BASE_URL =
      this.storageService.getUserInfo("ANTHROPIC_BASE_URL");
    const ANTHROPIC_API_KEY =
      this.storageService.getUserInfo("ANTHROPIC_API_KEY");
    const ANTHROPIC_MODEL_NAME = this.storageService.getUserInfo(
      "ANTHROPIC_MODEL_NAME"
    );
    return ANTHROPIC_BASE_URL !== "undefined"
      ? createAnthropic({
          baseURL: ANTHROPIC_BASE_URL,
          apiKey: ANTHROPIC_API_KEY,
        })(ANTHROPIC_MODEL_NAME)
      : createAnthropic({
          apiKey: ANTHROPIC_API_KEY,
        })(ANTHROPIC_MODEL_NAME);
  }

  // Google Generative AI
  private googleLlmConnection() {
    const GOOGLE_BASE_URL = this.storageService.getUserInfo("GOOGLE_BASE_URL");
    const GOOGLE_API_KEY = this.storageService.getUserInfo("GOOGLE_API_KEY");
    const GOOGLE_MODEL_NAME =
      this.storageService.getUserInfo("GOOGLE_MODEL_NAME");
    return GOOGLE_BASE_URL !== "undefined"
      ? createGoogleGenerativeAI({
          baseURL: GOOGLE_BASE_URL,
          apiKey: GOOGLE_API_KEY,
        })(GOOGLE_MODEL_NAME)
      : createGoogleGenerativeAI({
          apiKey: GOOGLE_API_KEY,
        })(GOOGLE_MODEL_NAME);
  }

  // Ollama (local)
  private ollamaLlmConnection() {
    const OLLAMA_BASE_URL = this.storageService.getUserInfo("OLLAMA_BASE_URL");
    const OLLAMA_API_KEY = this.storageService.getUserInfo("OLLAMA_API_KEY");
    const OLLAMA_MODEL_NAME =
      this.storageService.getUserInfo("OLLAMA_MODEL_NAME");
    return OLLAMA_BASE_URL !== "undefined"
      ? createOllama({
          baseURL: OLLAMA_BASE_URL,
          headers: {
            Authorization: OLLAMA_API_KEY,
          },
        })(OLLAMA_MODEL_NAME)
      : createOllama({
          headers: {
            Authorization: OLLAMA_API_KEY,
          },
        })(OLLAMA_MODEL_NAME);
  }
}
