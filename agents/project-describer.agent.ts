import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { systemDescriberMessage, parseLlmResponse } from "../utils/index.js";
import { readdir } from "node:fs/promises";
import { LLMService } from "../services/llm.service.js";
import { Metadata } from "../types/app.types.js";

export class ProjectDescriberAgent {
  private llmService = new LLMService();

  private async queryProcessing(content: string) {
    const model = this.llmService.connection();
    const response = await model.invoke([new SystemMessage(content)]);

    return response.content as string;
  }

  public async getProjectDescription(uri: string): Promise<Metadata> {
    const files = (await this.getAllFilePaths(uri)).join("\n");
    const fileContext = `\n\nList of the files:
      \n${files}`;
    const message = systemDescriberMessage + fileContext;

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
