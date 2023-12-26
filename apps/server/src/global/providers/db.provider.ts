import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import { FactoryProvider, Logger } from '@nestjs/common';
import * as sqlite3 from 'better-sqlite3';
import { DBConfig } from 'src/config';
import { DefaultLogger, LogWriter } from 'drizzle-orm';
import * as path from 'path';

export const DB = Symbol('DB_SERVICE');
export type DBType = BetterSQLite3Database;

export const DBProvider: FactoryProvider = {
  provide: DB,
  inject: [DBConfig.KEY],
  useFactory: () => {
    const logger = new Logger('db');

    logger.debug('Connnecting to DB...');

    const connection = sqlite3(path.join(__dirname, '../../../../store.db'), {
      fileMustExist: true,
    });

    logger.debug('Connected to DB');

    class CustomDBLogger implements LogWriter {
      write(message: string) {
        logger.verbose(message);
      }
    }

    return drizzle(connection, {
      logger: new DefaultLogger({ writer: new CustomDBLogger() }),
    });
  },
};
