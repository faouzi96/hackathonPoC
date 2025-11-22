import { createAzure } from "@ai-sdk/azure";
import { getUserInfo } from "../services/userInfoCollector.js";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI, google } from "@ai-sdk/google";
import { createOllama, ollama } from "ollama-ai-provider-v2";
import { createOpenAI } from "@ai-sdk/openai";

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
export const openaiLlmConnection = createOpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_API_KEY,
})(OPENAI_MODEL_NAME);

// Anthropic
const ANTHROPIC_BASE_URL = getUserInfo("ANTHROPIC_BASE_URL");
const ANTHROPIC_API_KEY = getUserInfo("ANTHROPIC_API_KEY");
const ANTHROPIC_MODEL_NAME = getUserInfo("ANTHROPIC_MODEL_NAME");
export const anthropicLlmConnection = createAnthropic({
  baseURL: ANTHROPIC_BASE_URL,
  apiKey: ANTHROPIC_API_KEY,
})(ANTHROPIC_MODEL_NAME);

// Google Generative AI
const GOOGLE_BASE_URL = getUserInfo("GOOGLE_BASE_URL");
const GOOGLE_API_KEY = getUserInfo("GOOGLE_API_KEY");
const GOOGLE_MODEL_NAME = getUserInfo("GOOGLE_MODEL_NAME");
export const googleLlmConnection = createGoogleGenerativeAI({
  baseURL: GOOGLE_BASE_URL,
  apiKey: GOOGLE_API_KEY,
})(GOOGLE_MODEL_NAME);

// Ollama (local)
const OLLAMA_BASE_URL = getUserInfo("OLLAMA_BASE_URL");
const OLLAMA_API_KEY = getUserInfo("OLLAMA_API_KEY");
const OLLAMA_MODEL_NAME = getUserInfo("OLLAMA_MODEL_NAME");
export const ollamaLlmConnection = createOllama({
  baseURL: OLLAMA_BASE_URL,
  headers: {
    Authorization: OLLAMA_API_KEY,
  },
})(OLLAMA_MODEL_NAME);

// vLLM (local)
const VLLM_BASE_URL = getUserInfo("VLLM_BASE_URL");
const VLLM_MODEL_NAME = getUserInfo("VLLM_MODEL_NAME");
const VLLM_KEY = getUserInfo("VLLM_API_KEY");
const vllmProvider = createOpenAI({
  baseURL: VLLM_BASE_URL,
  apiKey: VLLM_KEY, // vLLM doesn't require API key for local instances
});
export const vllmLlmConnection = vllmProvider(VLLM_MODEL_NAME);

// Define the type for LLM provider names
export type LlmProvider =
  | "azure"
  | "openai"
  | "anthropic"
  | "google"
  | "ollama"
  | "vllm";

// Method to get LLM connection based on provider name
export function getLlmConnection(provider: LlmProvider) {
  switch (provider) {
    case "azure":
      return azureLlmConnection;
    case "openai":
      return openaiLlmConnection;
    case "anthropic":
      return anthropicLlmConnection;
    case "google":
      return googleLlmConnection;
    case "ollama":
      return ollamaLlmConnection;
    case "vllm":
      return vllmLlmConnection;
    default:
      throw new Error(`Unknown LLM provider: ${provider}`);
  }
}

// Default connection (can be switched based on environment)
export const llmConnection = azureLlmConnection;
