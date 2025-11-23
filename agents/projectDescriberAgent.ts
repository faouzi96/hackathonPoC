import { generateText, ModelMessage } from "ai";
import { systemDescriberMessage } from "../utils/systemMessage.js";
import { readdir } from "node:fs/promises";
import { llmConnection } from "../globals/llmConnection.js";
import { parseLlmResponse } from "../utils/parseLlmResponse.js";

export type Metadata = {
  projectType: string;
  framework: string;
  ignorePatterns: string[];
  description: string;
};

async function queryProcessing(message: ModelMessage) {
  const finalResponse = await generateText({
    model: llmConnection,
    prompt: JSON.stringify(message),
  });

  return finalResponse.content[0].type === "text"
    ? finalResponse.content[0].text
    : "";
}

export async function getProjectDescription(uri: string): Promise<Metadata> {
  const files = (await getAllFilePaths(uri)).join("\n");
  const fileContext = `\n\nList of the files:
      \n${files}`;
  const message: ModelMessage = {
    role: "system",
    content: systemDescriberMessage + fileContext,
  };

  const response = await queryProcessing(message);
  return parseLlmResponse(response) as Metadata;
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
