import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { FlowDataService } from 'src/flow-data/flow-data.service';
import { FlowData } from 'types/app.types';

const FOLDER_PATH: string[] = ['..', 'files-storage'];

@Injectable()
export class FlowFilesService {
  constructor(private flowDataService: FlowDataService) {}

  public async readFile(fileHash: string): Promise<object> {
    try {
      const fileContent = await this.readJsonContent(fileHash);

      return JSON.parse(fileContent);
    } catch (error) {
      throw new Error(`Failed to read or parse file: ${error.message}`);
    }
  }

  async deleteFile(
    fileHash: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.flowDataService.deleteFlow(fileHash);
      // Static relative path: go up one level and then into 'data' folder
      const fullPath = path.resolve(
        process.cwd(),
        ...FOLDER_PATH,
        `${fileHash}.json`,
      );

      // Check if file exists before deleting
      await fs.promises.access(fullPath, fs.constants.F_OK);

      // Delete the file
      await fs.promises.unlink(fullPath);
      return {
        success: true,
        message: `File "${fileHash}" deleted successfully.`,
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found
        throw new NotFoundException(`File "${fileHash}" does not exist.`);
      }
      // Other errors
      throw new InternalServerErrorException(
        `Failed to delete file: ${error.message}`,
      );
    }
  }

  async saveJsonFile(
    title: string,
    data: FlowData,
  ): Promise<{ success: boolean; hashedName?: string; message: string }> {
    try {
      // Combine fields + ISO timestamp
      const isoDate = new Date().toISOString();
      const combinedString = `${title}-${data.metadata.projectType}-${data.metadata.framework}-${isoDate}`;

      // Hash the combined string (SHA256 for uniqueness)
      const hashedName = createHash('sha256')
        .update(combinedString)
        .digest('hex');

      // update the Flow Data
      await this.flowDataService.appendFlow({
        title: title,
        projectName: data.metadata.projectType,
        framework: data.metadata.framework,
        fileHash: hashedName,
        dateTime: isoDate,
      });

      // Final file name with .json extension
      const fileName = `${hashedName}.json`;

      // Static relative path: go up one level and then into 'data' folder
      const fullPath = path.resolve(process.cwd(), ...FOLDER_PATH, fileName);

      // Convert data to JSON string
      const jsonContent = JSON.stringify(data, null, 2);

      // Save file
      await fs.promises.writeFile(fullPath, jsonContent, 'utf-8');

      return {
        success: true,
        hashedName,
        message: `File saved successfully as ${fileName}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to save file: ${error.message}`,
      );
    }
  }

  private async readJsonContent(fileName: string) {
    try {
      const fullPath = path.resolve(
        process.cwd(),
        ...FOLDER_PATH,
        `${fileName}.json`,
      );

      return await fs.promises.readFile(fullPath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file: ${error.message}`);
    }
  }
}
