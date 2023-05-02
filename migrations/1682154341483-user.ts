import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class create_user_and_posts_tables1612345678901
  implements MigrationInterface
{
  name = 'create_user_and_posts_tables1612345678901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (
        \`user_id\` bigint NOT NULL AUTO_INCREMENT,
        \`user_email\` varchar(255) NOT NULL,
        \`user_name\` varchar(255) NOT NULL,
        \`user_password\` varchar(255) NOT NULL,
        \`role\` enum('User','Admin','PowerUser','SupportDesk') NOT NULL DEFAULT 'User',
        PRIMARY KEY (\`user_id\`)
      ) ENGINE=InnoDB`,
    );

    await queryRunner.query(
      `CREATE TABLE \`posts\` (
        \`id\` bigint NOT NULL AUTO_INCREMENT,
        \`title\` varchar(255) NOT NULL,
        \`content\` varchar(255) NULL,
        \`userId\` bigint NOT NULL,
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_7ef1260a42c6fe8f6e1b7e3b6c2\`
          FOREIGN KEY (\`userId\`)
          REFERENCES \`user\` (\`user_id\`)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      ) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`posts\``);
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
