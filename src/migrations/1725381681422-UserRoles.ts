import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class UserRoles1725381681422 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create permissions table
        await queryRunner.createTable(
            new Table({
              name: 'user_roles',
              columns: [
                {
                  name: 'role_id',
                  type: 'bigint',
                },
                {
                  name: 'user_id',
                  type: 'bigint',
                },
              ],
              foreignKeys: [
                {
                  columnNames: ['role_id'],
                  referencedTableName: 'roles',
                  referencedColumnNames: ['id'],
                  onDelete: 'CASCADE',
                },
                {
                  columnNames: ['user_id'],
                  referencedTableName: 'users',
                  referencedColumnNames: ['id'],
                  onDelete: 'CASCADE',
                },
              ],
              indices: [
                {
                  columnNames: ['role_id', 'user_id'],
                  isUnique: true,
                },
              ],
            }),
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user_roles');
    }

}
