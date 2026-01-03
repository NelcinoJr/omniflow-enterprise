import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkerProcessor } from './worker.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './audit-log.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, WorkerProcessor],
})
export class AppModule { }