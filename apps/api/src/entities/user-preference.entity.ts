import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_preferences')
export class UserPreference {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text', {
    name: 'topic_ids',
    array: true,
    default: () => "'{}'"
  })
  topicIds!: string[];

  @Column('text', {
    name: 'source_ids',
    array: true,
    default: () => "'{}'"
  })
  sourceIds!: string[];

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId!: string;

  @OneToOne(() => User, (user) => user.preference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}