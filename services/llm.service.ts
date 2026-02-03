import { ChatOpenAI } from "@langchain/openai";
import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOllama } from "@langchain/ollama";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { LlmProvider } from "../types/app.types.js";
import { StorageService } from "./storage.service.js";

export class LLMService {
  private storageService: StorageService = new StorageService();

  // Default connection (can be switched based on environment)
  public connection(): BaseChatModel {
    return this.getLlmConnection(
      this.storageService.getUserInfo("PROVIDER") as LlmProvider,
    );
  }

  // Method to get LLM connection based on provider name
  private getLlmConnection(provider: LlmProvider): BaseChatModel {
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
  private azureLlmConnection(): BaseChatModel {
    const AZURE_AI_KEY = this.storageService.getUserInfo("AZURE_AI_KEY");
    const AZURE_AI_API_VERSION = this.storageService.getUserInfo(
      "AZURE_AI_API_VERSION",
    );
    const AZURE_AI_ENDPOINT =
      this.storageService.getUserInfo("AZURE_AI_ENDPOINT");
    const AZURE_MODEL_NAME =
      this.storageService.getUserInfo("AZURE_MODEL_NAME");

    return new ChatOpenAI({
      model: AZURE_MODEL_NAME,
      apiKey: AZURE_AI_KEY,
      configuration: {
        baseURL: AZURE_AI_ENDPOINT,
        defaultQuery: { "api-version": AZURE_AI_API_VERSION },
      },
    });
  }

  // OpenAI
  private openaiLlmConnection(): BaseChatModel {
    const OPENAI_BASE_URL = this.storageService.getUserInfo("OPENAI_BASE_URL");
    const OPENAI_API_KEY = this.storageService.getUserInfo("OPENAI_API_KEY");
    const OPENAI_MODEL_NAME =
      this.storageService.getUserInfo("OPENAI_MODEL_NAME");

    return new ChatOpenAI({
      openAIApiKey: OPENAI_API_KEY,
      modelName: OPENAI_MODEL_NAME,
      ...(OPENAI_BASE_URL !== "undefined" && {
        configuration: {
          baseURL: OPENAI_BASE_URL,
        },
      }),
    });
  }

  // Anthropic
  private anthropicLlmConnection(): BaseChatModel {
    const ANTHROPIC_BASE_URL =
      this.storageService.getUserInfo("ANTHROPIC_BASE_URL");
    const ANTHROPIC_API_KEY =
      this.storageService.getUserInfo("ANTHROPIC_API_KEY");
    const ANTHROPIC_MODEL_NAME = this.storageService.getUserInfo(
      "ANTHROPIC_MODEL_NAME",
    );

    return new ChatAnthropic({
      anthropicApiKey: ANTHROPIC_API_KEY,
      modelName: ANTHROPIC_MODEL_NAME,
      ...(ANTHROPIC_BASE_URL !== "undefined" && {
        clientOptions: {
          baseURL: ANTHROPIC_BASE_URL,
        },
      }),
    });
  }

  // Google Generative AI
  private googleLlmConnection(): BaseChatModel {
    const GOOGLE_BASE_URL = this.storageService.getUserInfo("GOOGLE_BASE_URL");
    const GOOGLE_API_KEY = this.storageService.getUserInfo("GOOGLE_API_KEY");
    const GOOGLE_MODEL_NAME =
      this.storageService.getUserInfo("GOOGLE_MODEL_NAME");

    return new ChatGoogleGenerativeAI({
      apiKey: GOOGLE_API_KEY,
      model: GOOGLE_MODEL_NAME,
      ...(GOOGLE_BASE_URL !== "undefined" && {
        baseUrl: GOOGLE_BASE_URL,
      }),
    });
  }

  // Ollama (local)
  private ollamaLlmConnection(): BaseChatModel {
    const OLLAMA_BASE_URL = this.storageService.getUserInfo("OLLAMA_BASE_URL");
    const OLLAMA_MODEL_NAME =
      this.storageService.getUserInfo("OLLAMA_MODEL_NAME");

    return new ChatOllama({
      baseUrl:
        OLLAMA_BASE_URL !== "undefined"
          ? OLLAMA_BASE_URL
          : "http://localhost:11434",
      model: OLLAMA_MODEL_NAME,
    });
  }
}
