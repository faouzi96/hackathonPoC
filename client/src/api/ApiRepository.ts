import type { FlowData, FlowOverview } from "../types/app.types";
import api from "./apiConfig";

export default class ApiRepository {
  static async getFlowList(): Promise<FlowOverview[]> {
    const response = await api.get("/flow");
    return response.data;
  }

  static async getFlowDetails(fileHash: string): Promise<FlowData> {
    const response = await api.get(`/file/${fileHash}`);
    return response.data;
  }
}
