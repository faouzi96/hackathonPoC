import { createAzure } from "@ai-sdk/azure";
import "dotenv/config";
import { generateText, ModelMessage } from "ai";
import { systemMessage } from "../globals/systemMessage.js";
import { getUserInfo } from "../globals/userInfoCollector.js";

const AZURE_AI_KEY = getUserInfo("AZURE_AI_KEY");
const AZURE_AI_API_VERSION = getUserInfo("AZURE_AI_API_VERSION");
const AZURE_AI_ENDPOINT = getUserInfo("AZURE_AI_ENDPOINT");
const AZURE_RESOURCE_NAME = getUserInfo("AZURE_RESOURCE_NAME");
const AZURE_MODEL_NAME = getUserInfo("AZURE_MODEL_NAME");

const azure = createAzure({
  apiKey: AZURE_AI_KEY,
  apiVersion: AZURE_AI_API_VERSION,
  baseURL: AZURE_AI_ENDPOINT,
  resourceName: AZURE_RESOURCE_NAME,
});

async function queryProcessing(messages: ModelMessage[]) {
  const finalResponse = await generateText({
    model: azure(AZURE_MODEL_NAME),
    messages: messages,
  });

  return finalResponse.content[0].type === "text"
    ? finalResponse.content[0].text
    : "";
}

export async function getProjectStructure(jsonData: string) {
  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemMessage + jsonData,
    },
  ];

  const response = await queryProcessing(messages);
  return response;
}
