import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private consumer: Redis;
  private publisher: Redis;

  constructor(private configService: ConfigService) {}

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
    // Exemplo de worker simples
    // Na vida real usaríamos BullMQ, mas aqui queremos controle total (Redis puro)
    this.consumer.subscribe('omniflow_channel', (err, count) => {
      if (err) console.error(err.message);
      console.log(`Subscribed to ${count} channels.`);
    });

    this.consumer.on('message', (channel, message) => {
      console.log(`Received message from ${channel}: ${message}`);
      // Aqui entraria a lógica pesada + Salvar no Mongo
    });
  }
}
