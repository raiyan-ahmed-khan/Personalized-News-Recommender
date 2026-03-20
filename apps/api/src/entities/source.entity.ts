import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SourceType } from './enums/source-type.enum';
import { Article } from './article.entity';

@Entity('sources')
export class Source {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  url!: string;

  @Column({ name: 'rss_url', type: 'varchar', nullable: true })
  rssUrl!: string | null;

  @Column()
  country!: string;

  @Column()
  language!: string;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
    enumName: 'source_type_enum'
  })
  sourceType!: SourceType;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => Article, (article) => article.source)
  articles?: Article[];
}