import { generateText, ModelMessage } from "ai";
import { systemMessage } from "../utils/systemMessage.js";
import { llmConnection } from "../globals/llmConnection.js";

async function queryProcessing(message: ModelMessage) {
  const finalResponse = await generateText({
    model: llmConnection,
    prompt: JSON.stringify(message),
  });

  return finalResponse.content[0].type === "text"
    ? finalResponse.content[0].text
    : "";
}

export async function getProjectStructure(jsonData: string) {
  const message: ModelMessage = {
    role: "system",
    content: systemMessage + jsonData,
  };

  const response = await queryProcessing(message);
  return response;
}
