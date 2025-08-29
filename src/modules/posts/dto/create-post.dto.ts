import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: '제목은 200자를 초과할 수 없습니다.' })
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: '작성자명은 100자를 초과할 수 없습니다.' })
  author: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}