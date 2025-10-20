import { generateText, ModelMessage } from "ai";
import { systemDescriberMessage } from "../utils/systemMessage.js";
import { readdir } from "node:fs/promises";
import { llmConnection } from "../globals/llmConnection.js";

export type Metadata = {
  projectType: string;
  framework: string;
  ignorePatterns: string[];
  description: string;
};

async function queryProcessing(messages: ModelMessage[]) {
  const finalResponse = await generateText({
    model: llmConnection,
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
