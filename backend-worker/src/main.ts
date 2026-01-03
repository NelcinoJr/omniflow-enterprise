import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para os Frontends (Vue e Angular) conseguirem acessar
  app.enableCors();

  // Define um prefixo global opcional para organização
  // app.setGlobalPrefix('api'); 

  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 NestJS Worker API rodando em: http://localhost:3000');
}
bootstrap();
