import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { WorkerProcessor } from './worker.processor';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private consumer: Redis;
    private publisher: Redis;

    constructor(
        private configService: ConfigService,
        private workerProcessor: WorkerProcessor // Injeção do Processador
    ) { }

    onModuleInit() {
        this.consumer = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
        });

        this.publisher = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
        });

        console.log('Redis Connected! 🚀');
        this.startListening();
    }

    onModuleDestroy() {
        this.consumer.disconnect();
        this.publisher.disconnect();
    }

    async startListening() {
        // Inscreve no canal do OmniFlow
        this.consumer.subscribe('omniflow_channel', (err: any, count: any) => {
            if (err) console.error(err.message);
            console.log(`🎧 Ouvindo ${count} canal(is). Aguardando Jobs...`);
        });

        // Quando chegar mensagem, passa para o operário
        this.consumer.on('message', (channel: string, message: string) => {
            console.log(`📨 Nova mensagem no canal: ${channel}`);
            this.workerProcessor.process(message);
        });
    }
}
