import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Course } from './course.entity';
import { CourseResolver } from './course.resolver';
import { AdvisoryRecordResolver } from './advisoryRecord/advisoryRecord.resolver';
//import { AddUserAdvisoryRecord } from './advisoryRecord/advisoryRecord';

@Module({
  imports: [MikroOrmModule.forFeature([Course])],
  providers: [CourseService, CourseResolver, AdvisoryRecordResolver],
})
export class CourseModule {}
