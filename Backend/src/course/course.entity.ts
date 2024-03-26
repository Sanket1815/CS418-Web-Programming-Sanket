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

@ObjectType()
export class Prerequisites {
  @PrimaryKey()
  id!: string;

  @Property({ nullable: true })
  prerequisites?: string;
}

@Entity({ tableName: 'course' })
@ObjectType()
export class Course {
  @PrimaryKey({ type: 'uuid' })
  id!: uuidv4;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: false })
  courseName!: string;

  @Property({ nullable: false })
  level!: string;

  @Property({ nullable: true })
  department?: string;

  @Property({ type: 'json', nullable: true })
  prerequisites?: Prerequisites[];

  constructor() {
    this.id = uuidv4();
  }
}
