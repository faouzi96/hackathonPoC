import { createAzure } from "@ai-sdk/azure";
import { getUserInfo } from "../services/userInfoCollector.js";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOllama } from "ollama-ai-provider-v2";
import { createOpenAI } from "@ai-sdk/openai";
import { LlmProvider } from "../types/app.types.js";

const AZURE_AI_KEY = getUserInfo("AZURE_AI_KEY");
const AZURE_AI_API_VERSION = getUserInfo("AZURE_AI_API_VERSION");
const AZURE_AI_ENDPOINT = getUserInfo("AZURE_AI_ENDPOINT");
const AZURE_RESOURCE_NAME = getUserInfo("AZURE_RESOURCE_NAME");
const AZURE_MODEL_NAME = getUserInfo("AZURE_MODEL_NAME");

// Azure AI
export const azureLlmConnection = createAzure({
  apiKey: AZURE_AI_KEY,
  apiVersion: AZURE_AI_API_VERSION,
  baseURL: AZURE_AI_ENDPOINT,
  resourceName: AZURE_RESOURCE_NAME,
})(AZURE_MODEL_NAME);

// OpenAI
const OPENAI_BASE_URL = getUserInfo("OPENAI_BASE_URL");
const OPENAI_API_KEY = getUserInfo("OPENAI_API_KEY");
const OPENAI_MODEL_NAME = getUserInfo("OPENAI_MODEL_NAME");
export const openaiLlmConnection =
  OPENAI_BASE_URL !== "undefined"
    ? createOpenAI({
        baseURL: OPENAI_BASE_URL,
        apiKey: OPENAI_API_KEY,
      })(OPENAI_MODEL_NAME)
    : createOpenAI({
        apiKey: OPENAI_API_KEY,
      })(OPENAI_MODEL_NAME);

// Anthropic
const ANTHROPIC_BASE_URL = getUserInfo("ANTHROPIC_BASE_URL");
const ANTHROPIC_API_KEY = getUserInfo("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL_NAME = getUserInfo("ANTHROPIC_MODEL_NAME");
export const anthropicLlmConnection =
  ANTHROPIC_BASE_URL !== "undefined"
    ? createAnthropic({
        baseURL: ANTHROPIC_BASE_URL,
        apiKey: ANTHROPIC_API_KEY,
      })(ANTHROPIC_MODEL_NAME)
    : createAnthropic({
        apiKey: ANTHROPIC_API_KEY,
      })(ANTHROPIC_MODEL_NAME);

// Google Generative AI
const GOOGLE_BASE_URL = getUserInfo("GOOGLE_BASE_URL");
const GOOGLE_API_KEY = getUserInfo("GOOGLE_API_KEY");
const GOOGLE_MODEL_NAME = getUserInfo("GOOGLE_MODEL_NAME");
export const googleLlmConnection =
  GOOGLE_BASE_URL !== "undefined"
    ? createGoogleGenerativeAI({
        baseURL: GOOGLE_BASE_URL,
        apiKey: GOOGLE_API_KEY,
      })(GOOGLE_MODEL_NAME)
    : createGoogleGenerativeAI({
        apiKey: GOOGLE_API_KEY,
      })(GOOGLE_MODEL_NAME);

// Ollama (local)
const OLLAMA_BASE_URL = getUserInfo("OLLAMA_BASE_URL");
const OLLAMA_API_KEY = getUserInfo("OLLAMA_API_KEY");
const OLLAMA_MODEL_NAME = getUserInfo("OLLAMA_MODEL_NAME");
export const ollamaLlmConnection =
  OLLAMA_BASE_URL !== "undefined"
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

// Method to get LLM connection based on provider name
export function getLlmConnection(provider: LlmProvider) {
  switch (provider) {
    case "Azure":
      return azureLlmConnection;
    case "Openai":
      return openaiLlmConnection;
    case "Anthropic":
      return anthropicLlmConnection;
    case "Google":
      return googleLlmConnection;
    case "Ollama":
      return ollamaLlmConnection;
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

// Default connection (can be switched based on environment)
export const llmConnection = () =>
  getLlmConnection(getUserInfo("PROVIDER") as LlmProvider);
