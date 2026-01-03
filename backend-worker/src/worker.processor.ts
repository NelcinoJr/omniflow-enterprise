import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';

@Injectable()
export class WorkerProcessor {
    constructor(
        @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>
    ) { }

    async process(message: string) {
        console.log('👷 WORKER: Nova tarefa recebida do Redis');

        let data: any;
        try {
            data = JSON.parse(message);
        } catch (e) {
            console.error('❌ WORKER: Erro ao processar JSON', e.message);
            return;
        }

        console.log(`📠 Processando Relatório para: ${data.user_email || 'anônimo'}`);

        // Simulação de delay de processamento
        await new Promise(r => setTimeout(r, 2000));

        try {
            const logEntry = new this.auditLogModel({
                task_type: data.task_type || 'UNKNOWN',
                user_email: data.user_email || 'unknown@omniflow.com',
                payload: data,
                status: 'SUCCESS'
            });

            await logEntry.save();
            console.log('✅ WORKER: Tarefa concluída e persistida no MongoDB!');
        } catch (dbError) {
            console.error('❌ WORKER: Falha ao salvar log no MongoDB', dbError.message);
        }
    }
}