import { generateText, ModelMessage } from "ai";
import { systemMessage } from "../utils/systemMessage.js";
import { llmConnection } from "../globals/llmConnection.js";

async function queryProcessing(messages: ModelMessage[]) {
  const finalResponse = await generateText({
    model: llmConnection,
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
