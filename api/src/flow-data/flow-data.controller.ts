import { Controller, Get } from '@nestjs/common';
import { FlowDataService } from './flow-data.service';

@Controller()
export class FlowDataController {
  constructor(private readonly flowDataService: FlowDataService) {}

  @Get('/flow')
  getFlowList() {
    return this.flowDataService.getFlowList();
  }
}
