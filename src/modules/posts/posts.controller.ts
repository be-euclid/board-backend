import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post as PostEntity } from '../../entities/post.entity';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  async findAll(
    @Query('category') categoryId?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<{ posts: PostEntity[]; total: number; page: number; totalPages: number }> {
    const { posts, total } = await this.postsService.findAll(categoryId, page, limit);
    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<{ posts: PostEntity[]; total: number; page: number; totalPages: number }> {
    const { posts, total } = await this.postsService.search(query, page, limit);
    return {
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  @Get('category/:categoryId')
  async findByCategory(@Param('categoryId') categoryId: string): Promise<PostEntity[]> {
    return this.postsService.findByCategory(categoryId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePostDto: UpdatePostDto
  ): Promise<PostEntity> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.postsService.remove(id);
    return { message: '게시글이 삭제되었습니다.' };
  }
}