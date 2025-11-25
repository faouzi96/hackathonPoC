import { RunnableLambda, RunnableSequence } from "@langchain/core/runnables";
import {
  codeAnalyzerAgentResponse,
  describerAgentResponse,
  graphAgentResponse,
} from "../mocks/llm.mock.js";
import { ProjectDescriberAgent } from "../agents/project-describer.agent.js";
import { Metadata } from "../types/app.types.js";
import { CodeAnalyzerAgent } from "../agents/code-analyzer.agent.js";
import { GraphAgent } from "../agents/graph.agent.js";
import "dotenv/config";

export class LangchainService {
  public static pipeline() {
    const describerAgentRunnable = RunnableLambda.from(async (uri: string) => {
      console.info(
        "\x1b[34m%s\x1b[0m",
        "🤖 Agent 1: Analyzing and Describing the Project..."
      );
      if (process.env.NODE_ENV === "development")
        return { uri, metadata: describerAgentResponse };
      const describerAgent = new ProjectDescriberAgent();
      const metadata = await describerAgent.getProjectDescription(uri);
      return { uri, metadata };
    });

    const codeAnalyzerAgentRunnable = RunnableLambda.from(
      async (args: { uri: string; metadata: Metadata }) => {
        console.info(
          "\x1b[34m%s\x1b[0m",
          "🧠 Agent 2: Loading and Analyzing File Content..."
        );
        if (process.env.NODE_ENV === "development")
          return {
            data: codeAnalyzerAgentResponse,
            metadata: describerAgentResponse,
          };
        const codeAnalyzerAgent = new CodeAnalyzerAgent();
        const data = await codeAnalyzerAgent.localMcpClientCodeAnalyser(
          args.uri,
          args.metadata
        );
        return { data: data, metadata: args.metadata };
      }
    );

    const graphAgentRunnable = RunnableLambda.from(
      async (agrs: { data: string; metadata: Metadata }) => {
        console.info(
          "\x1b[34m%s\x1b[0m",
          "🔗 Agent 3: Generating the Project Graph..."
        );
        if (process.env.NODE_ENV === "development")
          return {
            graph: JSON.stringify(graphAgentResponse),
            metadata: describerAgentResponse,
          };
        const graphAgent = new GraphAgent();
        const graph = await graphAgent.getProjectStructure(agrs.data);
        return { graph: graph, metadata: agrs.metadata };
      }
    );

    return RunnableSequence.from([
      describerAgentRunnable,
      codeAnalyzerAgentRunnable,
      graphAgentRunnable,
    ]);
  }
}
