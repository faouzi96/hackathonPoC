import { Module } from '@nestjs/common';
import { FlowDataService } from './flow-data.service';
import { FlowDataController } from './flow-data.controller';

@Module({
  controllers: [FlowDataController],
  providers: [FlowDataService],
  exports: [FlowDataService],
})
export class FlowDataModule {}
