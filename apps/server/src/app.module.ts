import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global/global.module';
import { ConfigModule } from '@nestjs/config';
import { DBConfig } from './config';

@Module({
  imports: [
    GlobalModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DBConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
