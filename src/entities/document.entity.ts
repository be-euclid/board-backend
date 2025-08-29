import { 
  Entity, 
  PrimaryColumn, 
  Column, 
  OneToMany, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn, 
  UpdateDateColumn,
  Index 
} from 'typeorm';
import { Section } from './section.entity';
import { Category } from './category.entity';

@Entity('documents')
@Index(['categoryId'])
@Index(['title'])
export class Document {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'jsonb' }) // PostgreSQL의 JSONB 타입 사용
  toc: string[];

  @Column({ name: 'category_id', type: 'varchar', length: 50 })
  categoryId: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @OneToMany(() => Section, section => section.document, { cascade: true })
  sections: Section[];

  @ManyToOne(() => Category, category => category.documents, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}