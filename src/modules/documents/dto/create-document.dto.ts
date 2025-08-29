import { IsString, IsNotEmpty, IsArray, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  toc: string[];

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  sections: {
    title: string;
    content: string;
    order: number;
  }[];
}