import { createAzure } from "@ai-sdk/azure";
import "dotenv/config";
import { generateText, ModelMessage } from "ai";
import { systemMessage } from "../globals/systemMessage";

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
