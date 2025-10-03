import { createAzure } from "@ai-sdk/azure";
import "dotenv/config";
import { generateText, ModelMessage } from "ai";
import { systemDescriberMessage } from "../globals/systemMessage";
import { readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const azure = createAzure({
  apiKey: process.env.AZURE_AI_KEY,
  apiVersion: process.env.AZURE_AI_API_VERSION,
  baseURL: process.env.AZURE_AI_ENDPOINT,
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

async function queryProcessing(messages: ModelMessage[]) {
  const finalResponse = await generateText({
    model: azure("gpt-4.5-mini"),
    messages: messages,
  });

  return finalResponse.content[0].type === "text"
    ? finalResponse.content[0].text
    : "";
}

export async function getProjectDescription(uri: string) {
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
  return JSON.parse(response);
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
