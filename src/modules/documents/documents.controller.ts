import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from '../../entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';

@Controller('api/documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  async create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Get()
  async findAll(@Query('category') categoryId?: string): Promise<Document[]> {
    return this.documentsService.findAll(categoryId);
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<Document[]> {
    return this.documentsService.search(query);
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string): Promise<Document[]> {
    return this.documentsService.findByCategory(categoryId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }
}