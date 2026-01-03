import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>
  ) { }

  getHello(): string {
    return 'OmniFlow Worker API - Sistema de Auditoria Online 🚀';
  }

  // Método para buscar os últimos logs do MongoDB
  async getAuditLogs() {
    return this.auditLogModel.find()
      .sort({ createdAt: -1 }) // Mais recentes primeiro
      .limit(50)               // Limite de 50 para performance
      .exec();
  }
}
