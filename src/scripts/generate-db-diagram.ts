import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from '../config/database.config';
import { DataSourceOptions } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

interface TableInfo {
  tableName: string;
  columns: ColumnInfo[];
  relations: RelationInfo[];
}

interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  isPrimary: boolean;
  isForeign: boolean;
  defaultValue?: string;
}

interface RelationInfo {
  type: 'OneToMany' | 'ManyToOne';
  targetTable: string;
  sourceColumn: string;
  targetColumn: string;
}

export async function generateDBDiagram() {
  const configService = new ConfigService();
  const config = getDatabaseConfig(configService) as DataSourceOptions;
  const dataSource = new DataSource(config);

  try {
    await dataSource.initialize();
    console.log('데이터베이스 연결 성공');

    // 테이블 정보 조회
    const tables = await getTableInfo(dataSource);
    
    // Mermaid ERD 다이어그램 생성
    const mermaidERD = generateMermaidERD(tables);
    
    // PlantUML 다이어그램 생성
    const plantUMLERD = generatePlantUMLERD(tables);
    
    // 파일 저장
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    fs.writeFileSync(path.join(docsDir, 'db-diagram-mermaid.md'), mermaidERD);
    fs.writeFileSync(path.join(docsDir, 'db-diagram-plantuml.puml'), plantUMLERD);
    
    // 테이블 정보 JSON 저장
    fs.writeFileSync(
      path.join(docsDir, 'db-structure.json'), 
      JSON.stringify(tables, null, 2)
    );

    console.log('DB 다이어그램 생성 완료');
    console.log('파일 위치:');
    console.log('   - docs/db-diagram-mermaid.md');
    console.log('   - docs/db-diagram-plantuml.puml');
    console.log('   - docs/db-structure.json');

  } catch (error) {
    console.error( 'DB 다이어그램 생성 실패:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

async function getTableInfo(dataSource: DataSource): Promise<TableInfo[]> {
  const tables: TableInfo[] = [];
  
  // 테이블 목록 조회
  const tableNames = await dataSource.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

  for (const { table_name } of tableNames) {
    // 컬럼 정보 조회
    const columns = await dataSource.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position
    `, [table_name]);

    // Foreign Key 정보 조회
    const foreignKeys = await dataSource.query(`
      SELECT 
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.key_column_usage AS kcu
      JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = kcu.constraint_name
      JOIN information_schema.table_constraints AS tc
      ON tc.constraint_name = kcu.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND kcu.table_schema = 'public'
      AND kcu.table_name = $1
    `, [table_name]);

    const columnInfos: ColumnInfo[] = columns.map(col => ({
      name: col.column_name,
      type: col.character_maximum_length 
        ? `${col.data_type}(${col.character_maximum_length})`
        : col.data_type,
      nullable: col.is_nullable === 'YES',
      isForeign: foreignKeys.some(fk => fk.column_name === col.column_name),
      defaultValue: col.column_default
    }));

    // Relations 정보 구성
    const relations: RelationInfo[] = foreignKeys.map(fk => ({
      type: 'ManyToOne' as const,
      targetTable: fk.foreign_table_name,
      sourceColumn: fk.column_name,
      targetColumn: fk.foreign_column_name
    }));

    tables.push({
      tableName: table_name,
      columns: columnInfos,
      relations: relations
    });
  }

  return tables;
}

function generateMermaidERD(tables: TableInfo[]): string {
  let mermaid = `# 새내기 알림장 데이터베이스 ERD

\`\`\`mermaid
erDiagram
`;

  // 테이블 정의
  tables.forEach(table => {
    mermaid += `    ${table.tableName.toUpperCase()} {\n`;
    
    table.columns.forEach(col => {
      const type = col.type.toLowerCase();
      const pk = col.isPrimary ? ' PK' : '';
      const fk = col.isForeign ? ' FK' : '';
      const nullable = col.nullable ? '' : ' NOT NULL';
      
      mermaid += `        ${type} ${col.name}${pk}${fk}${nullable}\n`;
    });
    
    mermaid += `    }\n\n`;
  });

  // 관계 정의
  tables.forEach(table => {
    table.relations.forEach(rel => {
      if (rel.type === 'ManyToOne') {
        mermaid += `    ${table.tableName.toUpperCase()} }o--|| ${rel.targetTable.toUpperCase()} : "belongs to"\n`;
      }
    });
  });

  mermaid += `\`\`\`

## 테이블 설명
### categories (카테고리)
- 게시글과 문서를 분류하는 카테고리 정보
- 게시판: class(수업)
- 문서: cat1(새내기가이드)

### posts (게시글)
- 사용자들이 작성하는 게시글
- 각 게시글은 하나의 카테고리에 속함
- 조회수 추적 기능

### documents (문서)
- 구조화된 가이드 문서
- 목차(toc) 정보를 JSON 형태로 저장
- 여러 섹션으로 구성

### sections (섹션)
- 문서의 세부 섹션
- 순서(order)를 가지며 문서 내에서 정렬됨
- 각 섹션은 하나의 문서에 속함

## 주요 관계

1. **categories → posts**: 1:N 관계
   - 하나의 카테고리는 여러 게시글을 가질 수 있음

2. **categories → documents**: 1:N 관계
   - 하나의 카테고리는 여러 문서를 가질 수 있음

3. **documents → sections**: 1:N 관계
   - 하나의 문서는 여러 섹션을 가질 수 있음
`;
  return mermaid;
}

function generatePlantUMLERD(tables: TableInfo[]): string {
  let plantuml = `@startuml 새내기알림장_DB_ERD
!theme aws-orange

`;
  // 엔티티 정의
  tables.forEach(table => {
    plantuml += `entity "${table.tableName}" as ${table.tableName} {\n`;
    
    table.columns.forEach(col => {
      const pkSymbol = col.isPrimary ? '*' : '';
      const fkSymbol = col.isForeign ? '#' : '';
      const symbol = pkSymbol || fkSymbol || '';
      
      plantuml += `  ${symbol}${col.name} : ${col.type}\n`;
    });
    
    plantuml += `}\n\n`;
  });

  // 관계 정의
  tables.forEach(table => {
    table.relations.forEach(rel => {
      if (rel.type === 'ManyToOne') {
        plantuml += `${table.tableName} }o--|| ${rel.targetTable} : "${rel.sourceColumn} -> ${rel.targetColumn}"\n`;
      }
    });
  });

  plantuml += `
note right of categories
  게시글과 문서를 분류하는
  카테고리 테이블
end note

note right of posts
  사용자 게시글
  조회수 추적 포함
end note

note right of documents
  구조화된 가이드 문서
  JSON 형태의 목차 포함
end note

note right of sections
  문서의 세부 섹션
  순서 정렬 지원
end note

@enduml`;

  return plantuml;
}

// CLI에서 실행
if (require.main === module) {
  generateDBDiagram()
    .then(() => {
      console.log('🎉 완료!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('실패:', error);
      process.exit(1);
    });
}