import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Article } from '../entities/article.entity';
import { Source } from '../entities/source.entity';
import { Topic } from '../entities/topic.entity';
import { User } from '../entities/user.entity';
import { UserInteraction } from '../entities/user-interaction.entity';
import { UserPreference } from '../entities/user-preference.entity';

const parsedPort = Number(process.env.POSTGRES_PORT ?? 5432);

const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  port: Number.isNaN(parsedPort) ? 5432 : parsedPort,
  username: process.env.POSTGRES_USER ?? 'pulse',
  password: process.env.POSTGRES_PASSWORD ?? 'pulse_local',
  database: process.env.POSTGRES_DB ?? 'pulse_dev',
  schema: 'public',
  synchronize: false,
  logging: false,
  entities: [Article, Source, Topic, User, UserInteraction, UserPreference],
  migrations: [__dirname + '/migrations/*{.ts,.js}']
});

export default appDataSource;