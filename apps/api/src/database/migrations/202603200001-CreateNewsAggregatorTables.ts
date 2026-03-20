import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewsAggregatorTables1773964800000 implements MigrationInterface {
  name = 'CreateNewsAggregatorTables1773964800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    await queryRunner.query(
      `CREATE TYPE "public"."source_type_enum" AS ENUM('rss', 'newsapi', 'twitter')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."interaction_type_enum" AS ENUM('open', 'save', 'skip', 'share')`
    );
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "avatar_url" character varying,
        "onboarded" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "topics" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "category" character varying NOT NULL,
        CONSTRAINT "UQ_topics_name" UNIQUE ("name"),
        CONSTRAINT "UQ_topics_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_topics_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "sources" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying NOT NULL,
        "url" character varying NOT NULL,
        "rss_url" character varying,
        "country" character varying NOT NULL,
        "language" character varying NOT NULL,
        "source_type" "public"."source_type_enum" NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        CONSTRAINT "PK_sources_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "articles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "title" character varying NOT NULL,
        "summary" text NOT NULL,
        "body" text,
        "url" character varying NOT NULL,
        "image_url" character varying,
        "published_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "fetched_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "source_type" "public"."source_type_enum" NOT NULL,
        "topic_tags" text array NOT NULL DEFAULT '{}',
        "language" character varying NOT NULL,
        "source_id" uuid NOT NULL,
        CONSTRAINT "UQ_articles_url" UNIQUE ("url"),
        CONSTRAINT "PK_articles_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "topic_ids" text array NOT NULL DEFAULT '{}',
        "source_ids" text array NOT NULL DEFAULT '{}',
        "user_id" uuid NOT NULL,
        CONSTRAINT "UQ_user_preferences_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_user_preferences_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "user_interactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "type" "public"."interaction_type_enum" NOT NULL,
        "duration_seconds" integer,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "user_id" uuid NOT NULL,
        "article_id" uuid NOT NULL,
        CONSTRAINT "PK_user_interactions_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "articles"
      ADD CONSTRAINT "FK_articles_source_id"
      FOREIGN KEY ("source_id") REFERENCES "sources"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
      ADD CONSTRAINT "FK_user_preferences_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_interactions"
      ADD CONSTRAINT "FK_user_interactions_user_id"
      FOREIGN KEY ("user_id") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "user_interactions"
      ADD CONSTRAINT "FK_user_interactions_article_id"
      FOREIGN KEY ("article_id") REFERENCES "articles"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_interactions"
      DROP CONSTRAINT "FK_user_interactions_article_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_interactions"
      DROP CONSTRAINT "FK_user_interactions_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "user_preferences"
      DROP CONSTRAINT "FK_user_preferences_user_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "articles"
      DROP CONSTRAINT "FK_articles_source_id"
    `);
    await queryRunner.query(`DROP TABLE "user_interactions"`);
    await queryRunner.query(`DROP TABLE "user_preferences"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "sources"`);
    await queryRunner.query(`DROP TABLE "topics"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."interaction_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."source_type_enum"`);
  }
}