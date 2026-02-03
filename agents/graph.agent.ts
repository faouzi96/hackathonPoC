import { SystemMessage } from "@langchain/core/messages";
import { systemMessage } from "../utils/index.js";
import { LLMService } from "../services/llm.service.js";

export class GraphAgent {
  private llmService = new LLMService();

  private async queryProcessing(content: string) {
    const model = this.llmService.connection();
    const response = await model.invoke([new SystemMessage(content)]);

    return response.content as string;
  }

  public async getProjectStructure(jsonData: string) {
    const message = systemMessage + jsonData;

    const response = await this.queryProcessing(message);
    return response;
  }
}
