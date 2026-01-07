import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogSchema } from './audit-log.schema';
import { ChatMessage } from './chat-message.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
    @InjectModel(ChatMessage.name) private chatModel: Model<ChatMessage>
  ) { }

  getHello(): string {
    return 'OmniFlow Worker API - Sistema de Auditoria Online 🚀';
  }

  async getAuditLogs() {
    return this.auditLogModel.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async getChatHistory(u1: string, u2: string) {
    const filter = u2.includes('@')
      ? { $or: [{ sender: u1, receiver: u2 }, { sender: u2, receiver: u1 }] }
      : { receiver: u2 }; // Caso seja um ID de grupo (não tem @)

    return this.chatModel.find(filter)
      .sort({ createdAt: 1 })
      .limit(100)
      .exec();
  }
}
