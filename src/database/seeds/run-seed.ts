import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../../app.module';
import { DataSource } from 'typeorm';
import { seedData } from './initial-data.seed';

async function runSeed() {
  const logger = new Logger('SeedRunner');
  let app;

  try {
    // NestJS 애플리케이션 컨텍스트 생성
    logger.log('NestJS 애플리케이션 컨텍스트 초기화 중...');
    app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['error', 'warn', 'log'], // 로그 레벨 설정
    });

    // DataSource 가져오기 (TypeORM)
    const dataSource = app.get(DataSource);
    
    if (!dataSource.isInitialized) {
      logger.log('데이터베이스 연결 초기화 중...');
      await dataSource.initialize();
    }

    // 연결 테스트
    await dataSource.query('SELECT 1');
    logger.log('✅ 데이터베이스 연결 성공');

    // 환경 정보 출력
    const config = app.get('ConfigService');
    const dbName = config?.get('DB_NAME') || 'Unknown';
    const nodeEnv = config?.get('NODE_ENV') || 'Unknown';
    
    logger.log(`📋 환경: ${nodeEnv}, 데이터베이스: ${dbName}`);

    // 시드 데이터 실행
    logger.log('시드 데이터 삽입 시작...');
    await seedData(dataSource);
    logger.log('시드 데이터 삽입 완료');

    // 결과 통계 출력
    await printSeedResults(dataSource, logger);

  } catch (error) {
    logger.error('시드 데이터 삽입 실패:', error.message);
    if (error.stack) {
      logger.error('Stack trace:', error.stack);
    }
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
      logger.log('🔌 애플리케이션 컨텍스트 종료');
    }
  }
}

// 시드 결과 통계 출력
async function printSeedResults(dataSource: DataSource, logger: Logger) {
  try {
    logger.log('시드 결과 통계:');
    
    const tables = [
      { name: 'categories', label: '카테고리' },
      { name: 'posts', label: '게시글' },
      { name: 'documents', label: '문서' },
      { name: 'sections', label: '섹션' }
    ];

    for (const table of tables) {
      try {
        const result = await dataSource.query(`SELECT COUNT(*) as count FROM ${table.name}`);
        const count = result[0]?.count || 0;
        logger.log(`  ${table.label}: ${count}개`);
      } catch (error) {
        logger.warn(`  ${table.label}: 조회 실패 (${error.message})`);
      }
    }
  } catch (error) {
    logger.warn('통계 조회 중 오류:', error.message);
  }
}

// CLI에서 직접 실행할 때
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('시드 실행 완료');
      process.exit(0);
    })
    .catch((error) => {
      console.error('시드 실행 실패:', error);
      process.exit(1);
    });
}

export { runSeed };