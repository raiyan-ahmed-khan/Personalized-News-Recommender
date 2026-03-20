import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserInteractionType } from './enums/user-interaction-type.enum';
import { User } from './user.entity';
import { Article } from './article.entity';

@Entity('user_interactions')
export class UserInteraction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: 'enum',
    enum: UserInteractionType,
    enumName: 'interaction_type_enum'
  })
  type!: UserInteractionType;

  @Column({ name: 'duration_seconds', type: 'int', nullable: true })
  durationSeconds!: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Column({ name: 'user_id', type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.interactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ name: 'article_id', type: 'uuid' })
  articleId!: string;

  @ManyToOne(() => Article, (article) => article.interactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}