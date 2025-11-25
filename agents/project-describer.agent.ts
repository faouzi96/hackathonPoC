import { generateText, ModelMessage } from "ai";
import { systemDescriberMessage, parseLlmResponse } from "../utils/index.js";
import { readdir } from "node:fs/promises";
import { LLMService } from "../services/llm.service.js";
import { Metadata } from "../types/app.types.js";

export class ProjectDescriberAgent {
  private llmService = new LLMService();

  private async queryProcessing(message: ModelMessage) {
    const finalResponse = await generateText({
      model: this.llmService.connection(),
      prompt: JSON.stringify(message),
    });

    return finalResponse.content[0].type === "text"
      ? finalResponse.content[0].text
      : "";
  }

  public async getProjectDescription(uri: string): Promise<Metadata> {
    const files = (await this.getAllFilePaths(uri)).join("\n");
    const fileContext = `\n\nList of the files:
      \n${files}`;
    const message: ModelMessage = {
      role: "system",
      content: systemDescriberMessage + fileContext,
    };

    const response = await this.queryProcessing(message);
    return parseLlmResponse(response) as Metadata;
  }

  private async getAllFilePaths(folderPath: string) {
    try {
      const files = await readdir(folderPath);
      return files;
    } catch (err) {
      console.error("Error reading folder:", err);
      return [];
    }
  }
}
