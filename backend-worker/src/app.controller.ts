import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('logs')
  async getLogs() {
    return this.appService.getAuditLogs();
  }

  @Get('chat/history')
  async getHistory(@Query('user1') u1: string, @Query('user2') u2: string) {
    return this.appService.getChatHistory(u1, u2);
  }
}
