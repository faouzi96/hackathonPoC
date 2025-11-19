import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FlowFilesService } from './flow-files.service';
import type { FlowData } from 'types/app.types';
import { SaveFlowDto } from './dto';

@Controller('file')
export class FlowFilesController {
  constructor(private readonly flowFilesService: FlowFilesService) {}

  @Get(':id')
  getFlow(@Param('id') hashFile: string) {
    return this.flowFilesService.readFile(hashFile);
  }

  @Delete(':id')
  deleteFlow(@Param('id') hashFile: string) {
    return this.flowFilesService.deleteFile(hashFile);
  }

  @Post()
  saveFlow(@Body() body: SaveFlowDto) {
    return this.flowFilesService.saveJsonFile(body.title, body.data);
  }
}
