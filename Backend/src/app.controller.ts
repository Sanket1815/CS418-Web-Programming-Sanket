import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MikroORM } from '@mikro-orm/core';
import { Admin } from './admin/admin.entity';
import { User } from './user/user.entity';

let entityManager = null;

export const getEntityManager = async () => {
  if (!entityManager) {
    const orm = await MikroORM.init({
      entities: [User, Admin],
      dbName: 'nestjsreact',
      type: 'mysql',
      // ...other Mikro-ORM options
    });

    entityManager = orm.em;
  }

  return entityManager;
};
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
