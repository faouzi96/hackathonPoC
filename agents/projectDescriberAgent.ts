import { createAzure } from "@ai-sdk/azure";
import "dotenv/config";
import { generateText, ModelMessage } from "ai";
import { systemDescriberMessage } from "../utils/systemMessage.js";
import { readdir } from "node:fs/promises";
import { getUserInfo } from "../services/userInfoCollector.js";

export type Metadata = {
  projectType: string;
  framework: string;
  ignorePatterns: string[];
  description: string;
};

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

export async function getProjectDescription(uri: string): Promise<Metadata> {
  const files = (await getAllFilePaths(uri)).join("\n");
  const fileContext = `\n\nList of the files:
      \n${files}`;
  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemDescriberMessage + fileContext,
    },
  ];

  const response = await queryProcessing(messages);
  return JSON.parse(response) as Metadata;
}

async function getAllFilePaths(folderPath: string) {
  try {
    const files = await readdir(folderPath);
    return files;
  } catch (err) {
    console.error("Error reading folder:", err);
    return [];
  }
}
