import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { SourceType } from './enums/source-type.enum';
import { Source } from './source.entity';
import { UserInteraction } from './user-interaction.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  summary!: string;

  @Column({ type: 'text', nullable: true })
  body!: string | null;

  @Column({ unique: true })
  url!: string;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl!: string | null;

  @Column({ name: 'published_at', type: 'timestamptz' })
  publishedAt!: Date;

  @Column({ name: 'fetched_at', type: 'timestamptz' })
  fetchedAt!: Date;

  @Column({
    name: 'source_type',
    type: 'enum',
    enum: SourceType,
    enumName: 'source_type_enum'
  })
  sourceType!: SourceType;

  @Column('text', {
    name: 'topic_tags',
    array: true,
    default: () => "'{}'"
  })
  topicTags!: string[];

  @Column()
  language!: string;

  @Column({ name: 'source_id', type: 'uuid' })
  sourceId!: string;

  @ManyToOne(() => Source, (source) => source.articles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_id' })
  source!: Source;

  @OneToMany(() => UserInteraction, (interaction) => interaction.article)
  interactions?: UserInteraction[];
}