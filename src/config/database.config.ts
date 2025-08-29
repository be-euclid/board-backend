import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Post } from '../entities/post.entity';
import { Document } from '../entities/document.entity';
import { Section } from '../entities/section.entity';
import { Category } from '../entities/category.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('DB_HOST', 'localhost'),
  port: +configService.get('DB_PORT', 5432),
  username: configService.get('DB_USERNAME', 'postgres'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME', 'board_db'),
  entities: [Post, Document, Section, Category],
  synchronize: configService.get('NODE_ENV') !== 'production', // 운영환경에서는 false
  logging: configService.get('NODE_ENV') === 'development',
  ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
});