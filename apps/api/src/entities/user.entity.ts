import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { UserInteraction } from './user-interaction.entity';
import { UserPreference } from './user-preference.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @Column({ name: 'avatar_url', type: 'varchar', nullable: true })
  avatarUrl!: string | null;

  @Column({ default: false })
  onboarded!: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @OneToOne(() => UserPreference, (preference) => preference.user)
  preference?: UserPreference;

  @OneToMany(() => UserInteraction, (interaction) => interaction.user)
  interactions?: UserInteraction[];
}