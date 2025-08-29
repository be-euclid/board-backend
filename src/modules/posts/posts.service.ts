import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postsRepository.create(createPostDto);
    return this.postsRepository.save(post);
  }

  async findAll(categoryId?: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
    const where = categoryId ? { categoryId } : {};
    
    const [posts, total] = await this.postsRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: ['category'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return { posts, total };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    // 조회수 증가 (PostgreSQL의 원자적 연산 사용)
    await this.postsRepository
      .createQueryBuilder()
      .update(Post)
      .set({ views: () => 'views + 1' })
      .where('id = :id', { id })
      .execute();
    
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const updateResult = await this.postsRepository.update(id, updatePostDto);
    
    if (updateResult.affected === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
  }

  async search(query: string, page = 1, limit = 10): Promise<{ posts: Post[]; total: number }> {
    // PostgreSQL의 전문 검색 기능 활용
    const [posts, total] = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .where('post.title ILIKE :query OR post.content ILIKE :query', { 
        query: `%${query}%` 
      })
      .orderBy('post.createdAt', 'DESC')
      .take(limit)
      .skip((page - 1) * limit)
      .getManyAndCount();

    return { posts, total };
  }

  async findByCategory(categoryId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: { categoryId },
      order: { createdAt: 'DESC' },
      relations: ['category'],
    });
  }
}