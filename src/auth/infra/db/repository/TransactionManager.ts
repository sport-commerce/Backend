import { Inject, Injectable } from '@nestjs/common';
import { ITransactionManager } from 'src/auth/domain/repository/itransaction-manager';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionManager implements ITransactionManager {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}
  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const result = await callback();

      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
