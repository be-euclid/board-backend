import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Document } from '../../entities/document.entity';
import { Section } from '../../entities/section.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
    private dataSource: DataSource,
  ) {}

  async findAll(categoryId?: string): Promise<Document[]> {
    const where = categoryId ? { categoryId } : {};
    return this.documentsRepository.find({
      where,
      relations: ['sections', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentsRepository.findOne({
      where: { id },
      relations: ['sections', 'category'],
    });

    if (!document) {
      throw new NotFoundException('문서를 찾을 수 없습니다.');
    }

    // 섹션을 order 순으로 정렬
    if (document.sections) {
      document.sections.sort((a, b) => a.order - b.order);
    }

    return document;
  }

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.dataSource.transaction(async manager => {
      // 문서 생성
      const document = manager.create(Document, {
        id: createDocumentDto.id,
        title: createDocumentDto.title,
        content: createDocumentDto.content,
        toc: createDocumentDto.toc,
        categoryId: createDocumentDto.categoryId,
      });

      const savedDocument = await manager.save(document);

      // 섹션 생성
      if (createDocumentDto.sections && createDocumentDto.sections.length > 0) {
        const sections = createDocumentDto.sections.map(section => 
          manager.create(Section, {
            ...section,
            documentId: savedDocument.id,
          })
        );

        await manager.save(sections);
      }

      return this.findOne(savedDocument.id);
    });
  }

  async search(query: string): Promise<Document[]> {
    return this.documentsRepository
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.sections', 'sections')
      .leftJoinAndSelect('document.category', 'category')
      .where('document.title ILIKE :query OR document.content ILIKE :query', { 
        query: `%${query}%` 
      })
      .orWhere('sections.title ILIKE :query OR sections.content ILIKE :query', { 
        query: `%${query}%` 
      })
      .orderBy('document.createdAt', 'DESC')
      .addOrderBy('sections.order', 'ASC')
      .getMany();
  }

  async findByCategory(categoryId: string): Promise<Document[]> {
    return this.documentsRepository.find({
      where: { categoryId },
      relations: ['sections', 'category'],
      order: { createdAt: 'DESC' },
    });
  }
}