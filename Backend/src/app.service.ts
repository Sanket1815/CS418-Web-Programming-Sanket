import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
