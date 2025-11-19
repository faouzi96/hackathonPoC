import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlowFilesService } from './flow-files/flow-files.service';
import { FlowFilesModule } from './flow-files/flow-files.module';

@Module({
  imports: [FlowFilesModule],
  controllers: [AppController],
  providers: [AppService, FlowFilesService],
})
export class AppModule {}
