import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Admin } from './admin.entity';
import { AdminResolver } from './admin.resolver';

@Module({
  imports: [MikroOrmModule.forFeature([Admin])],
  providers: [AdminService, AdminResolver],
})
export class StudentModule {}
