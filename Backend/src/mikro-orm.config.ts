import { Options } from '@mikro-orm/core';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as path from 'path';

const config: Options = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'pune@1998',
  dbName: 'nestjsreact',
  charset: 'utf8mb4', // Specify the character set for MySQL
  collate: 'utf8mb4_unicode_ci',
  entities: ['dist/**/*.entity.ts'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  migrations: {
    path: path.join(__dirname, './migrations'),
    pathTs: undefined,
  },
};

export default config;
