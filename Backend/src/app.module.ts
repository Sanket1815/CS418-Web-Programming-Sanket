import { Module } from '@nestjs/common';
import { ApolloDriver } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StudentModule } from './admin/admin.module';
import { GraphQLModule } from '@nestjs/graphql';
import { Admin } from './admin/admin.entity';
import config from './mikro-orm.config';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
//import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserModule } from './user/user.module';
import * as path from 'path';
import { JwtModule } from '@nestjs/jwt';
import { verifyToken } from './auth.service';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      autoSchemaFile: true,
      // context: ({ req }) => {
      //   const token = req.headers.authorization;
      //   console.log(`res ${token}`); // Directly get the token
      //   const user = token ? verifyToken(token) : null;
      //   return { user };
      // },
    }),
    MikroOrmModule.forRoot({
      debug: true,
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'pune@1998',
      dbName: 'nestjsreact',
      entities: ['dist/**/.entity.ts'],
      entitiesTs: ['src/**/.entity.ts'],
      autoLoadEntities: true,
      charset: 'utf8mb4', // Specify the character set for MySQL
      collate: 'utf8mb4_unicode_ci',

      // synchronize: true,
      metadataProvider: TsMorphMetadataProvider,
      migrations: {
        path: path.join(__dirname, './migrations'),
        pathTs: undefined,
      },
    }),
    JwtModule.register({}),
    StudentModule,
    UserModule,
    CourseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
