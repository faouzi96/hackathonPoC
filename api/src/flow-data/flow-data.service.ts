import {
  Injectable,
  InternalServerErrorException,
  Scope,
} from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import type { FlowOverview } from 'types/app.types';

const FOLDER_PATH: string[] = ['..', 'flowData.json'];

@Injectable()
export class FlowDataService {
  async getFlowList() {
    try {
      const fileContent = await this.readJsonContent();

      return JSON.parse(fileContent);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed parse file: ${error.message}`,
      );
    }
  }

  private async readJsonContent() {
    try {
      const fullPath = path.resolve(process.cwd(), ...FOLDER_PATH);
      return await fs.promises.readFile(fullPath, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to read file: ${error.message}`,
      );
    }
  }

  async appendFlow(data: FlowOverview) {
    try {
      const content = JSON.parse(
        await this.readJsonContent(),
      ) as FlowOverview[];

      await this.saveFlowData([...content, data]);
      return {
        success: true,
        message: `File saved successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save data: ${error.message}`,
      );
    }
  }

  async deleteFlow(fileHash: string) {
    try {
      const content = JSON.parse(
        await this.readJsonContent(),
      ) as FlowOverview[];

      const updatedContent = content.filter(
        (data) => data.fileHash !== fileHash,
      );
      await this.saveFlowData(updatedContent);
      return {
        success: true,
        message: `File updated successfully`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update data: ${error.message}`,
      );
    }
  }

  private async saveFlowData(data: FlowOverview[]) {
    try {
      const fullPath = path.resolve(process.cwd(), ...FOLDER_PATH);

      // Convert data to JSON string
      const jsonContent = JSON.stringify(data, null, 2);

      // Save file
      await fs.promises.writeFile(fullPath, jsonContent, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save file: ${error.message}`,
      );
    }
  }
}
