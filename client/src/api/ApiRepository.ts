import type { FlowData, FlowOverview, SaveFlowBody } from "../types/app.types";
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

  static async deleteFlow(fileHash: string) {
    const response = await api.delete(`/file/${fileHash}`);
    return response.data;
  }

  static async saveFlow(data: SaveFlowBody) {
    const response = await api.post("/file", data);
    return response.data as { hashedName: string };
  }
}
