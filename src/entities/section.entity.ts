import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn,
  Index 
} from 'typeorm';
import { Document } from './document.entity';

@Entity('sections')
@Index(['documentId', 'order'])
export class Section {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'section_order', type: 'integer' })
  order: number;

  @Column({ name: 'document_id', type: 'varchar', length: 50 })
  documentId: string;

  @ManyToOne(() => Document, document => document.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'document_id' })
  document: Document;
}