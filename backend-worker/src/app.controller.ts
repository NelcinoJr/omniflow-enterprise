import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Novo endpoint para o Painel Admin em Angular
  @Get('logs')
  async getLogs() {
    return this.appService.getAuditLogs();
  }
}
