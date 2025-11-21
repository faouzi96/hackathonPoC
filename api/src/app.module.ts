import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { FlowFilesService } from './flow-files/flow-files.service';
import { FlowFilesModule } from './flow-files/flow-files.module';
import { FlowDataModule } from './flow-data/flow-data.module';
import { join } from 'path';

@Module({
  imports: [
    FlowFilesModule,
    FlowDataModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'client', 'dist'),
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [FlowFilesService],
})
export class AppModule {}
