import { IsNotEmpty, IsString } from 'class-validator';

export class getFlowDto {
  @IsString()
  @IsNotEmpty()
  hash: string;
}
