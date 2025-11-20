import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FlowFilesService } from './flow-files/flow-files.service';
import { FlowFilesModule } from './flow-files/flow-files.module';
import { FlowDataModule } from './flow-data/flow-data.module';
@Module({
  imports: [FlowFilesModule, FlowDataModule],
  controllers: [AppController],
  providers: [FlowFilesService],
})
export class AppModule {}
