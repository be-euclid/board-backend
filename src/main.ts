import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // CORS 설정
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 글로벌 파이프 설정
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // API 전역 프리픽스 설정 (선택사항)
  // app.setGlobalPrefix('api');

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  
  logger.log(`🚀 백엔드 서버가 http://localhost:${port}에서 실행중입니다.`);
  logger.log(`📊 데이터베이스: PostgreSQL`);
  logger.log(`🌍 환경: ${configService.get('NODE_ENV', 'development')}`);
}

bootstrap().catch((error) => {
  Logger.error('❌ 서버 시작 실패:', error);
  process.exit(1);
});