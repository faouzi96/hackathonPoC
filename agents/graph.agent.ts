import { generateText, ModelMessage } from "ai";
import { systemMessage } from "../utils/index.js";
import { LLMService } from "../services/llm.service.js";

export class GraphAgent {
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

  public async getProjectStructure(jsonData: string) {
    const message: ModelMessage = {
      role: "system",
      content: systemMessage + jsonData,
    };

    const response = await this.queryProcessing(message);
    return response;
  }
}
