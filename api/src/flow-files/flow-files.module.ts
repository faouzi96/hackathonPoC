import { Module } from '@nestjs/common';
import { FlowFilesService } from './flow-files.service';
import { FlowFilesController } from './flow-files.controller';
import { FlowDataModule } from 'src/flow-data/flow-data.module';

@Module({
  controllers: [FlowFilesController],
  providers: [FlowFilesService],
  imports: [FlowDataModule],
})
export class FlowFilesModule {}
