import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { ObjectType } from '@nestjs/graphql';

@Entity({ tableName: 'user' })
@ObjectType()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id!: uuidv4;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ nullable: false })
  name!: string;

  @Property({ nullable: false })
  //@IsEmail()
  email!: string;

  @Property({ nullable: true })
  address?: string;

  @Property({ nullable: false })
  password!: string;

  @Property({ nullable: true, length: 500 })
  token!: string;

  @Property({ nullable: true })
  mobileNumber?: number;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ default: false })
  isAdmin: boolean;

  @Property({ nullable: true, length: 1000 })
  about?: string;

  @Property({ nullable: true })
  otp?: number;

  constructor() {
    this.id = uuidv4();
  }
}
