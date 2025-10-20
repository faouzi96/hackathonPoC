import { createAzure } from "@ai-sdk/azure";
import { getUserInfo } from "../services/userInfoCollector.js";

const AZURE_AI_KEY = getUserInfo("AZURE_AI_KEY");
const AZURE_AI_API_VERSION = getUserInfo("AZURE_AI_API_VERSION");
const AZURE_AI_ENDPOINT = getUserInfo("AZURE_AI_ENDPOINT");
const AZURE_RESOURCE_NAME = getUserInfo("AZURE_RESOURCE_NAME");
const AZURE_MODEL_NAME = getUserInfo("AZURE_MODEL_NAME");

export const llmConnection = createAzure({
  apiKey: AZURE_AI_KEY,
  apiVersion: AZURE_AI_API_VERSION,
  baseURL: AZURE_AI_ENDPOINT,
  resourceName: AZURE_RESOURCE_NAME,
})(AZURE_MODEL_NAME);
