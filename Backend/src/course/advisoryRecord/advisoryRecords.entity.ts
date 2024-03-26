import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  ManyToOne,
} from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ObjectType } from '@nestjs/graphql';
import { User } from '../../user/user.entity';
import { Course } from '../course.entity';

@ObjectType()
export class StudentCourses {
  @Property({ nullable: true })
  level?: string;

  @Property({ nullable: true })
  courseName?: string;
}

@ObjectType()
export class StudentPrequisites {
  @Property({ nullable: true })
  level?: string;

  @Property({ nullable: true })
  courseName?: string;
}

@Entity({ tableName: 'AdvisoryRecord' })
@ObjectType()
export class AdvisoryRecord {
  @PrimaryKey({ type: 'uuid' })
  id!: uuidv4;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt? = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt? = new Date();

  @Property({ nullable: true })
  term!: string;

  @Property({ nullable: true })
  status?: string;

  @Property({ nullable: true })
  gpa?: string;

  @Property({ nullable: true })
  lastTerm!: string;

  @Property({ type: 'json', nullable: true })
  courses?: StudentCourses[];

  @Property({ type: 'json', nullable: true })
  prerequisites?: StudentPrequisites[];
  //   @ManyToOne(() => User)
  //   user?: User;
  @ManyToOne(() => User)
  user?: User;

  constructor() {
    this.id = uuidv4();
  }
}

@Entity()
@ObjectType()
export class AdvisoryRecordDetails {
  @PrimaryKey({ type: 'uuid' })
  id!: uuidv4;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @ManyToOne(() => AdvisoryRecord)
  advisoryRecord!: AdvisoryRecord;

  @ManyToOne(() => Course)
  course!: Course;
}
