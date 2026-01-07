import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkerProcessor } from './worker.processor';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLog, AuditLogSchema } from './audit-log.schema';
import { ChatGateway } from './chat.gateway';
import { ChatMessage, ChatMessageSchema } from './chat-message.schema';

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
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: ChatMessage.name, schema: ChatMessageSchema }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, WorkerProcessor, ChatGateway],
})
export class AppModule { }