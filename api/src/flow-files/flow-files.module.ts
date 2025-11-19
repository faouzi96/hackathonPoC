import { Module } from '@nestjs/common';
import { FlowFilesService } from './flow-files.service';
import { FlowFilesController } from './flow-files.controller';

@Module({
  controllers: [FlowFilesController],
  providers: [FlowFilesService],
})
export class FlowFilesModule {}
