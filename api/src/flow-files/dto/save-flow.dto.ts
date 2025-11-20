import { IsNotEmpty, IsString } from 'class-validator';
import type { FlowData } from 'types/app.types';

export class SaveFlowDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  data: FlowData;
}
