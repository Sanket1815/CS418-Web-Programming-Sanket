import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserResolver } from './user.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UserService, UserResolver],
})
export class UserModule {}
