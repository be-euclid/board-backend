import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('새내기 알림장 API')
    .addTag('categories', '카테고리 관리 - 게시글과 문서의 분류')
    .addTag('posts', '게시글 관리 - 수업, 맛집, 기타 정보')
    .addTag('documents', '문서 관리 - 구조화된 가이드 문서')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  
  // Swagger UI 설정
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',       
      operationsSorter: 'alpha', 
      docExpansion: 'list',    
      filter: true,            
      tryItOutEnabled: true,  
    },
    customSiteTitle: '새내기 알림장 API',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b4151 }
    `,
  });

  console.log('📚 Swagger UI: http://localhost:3001/api-docs');
}