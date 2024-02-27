import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';

@Entity({ tableName: 'admin' })
export class Admin {
  @PrimaryKey({ type: 'uuid' })
  id!: uuidv4;

  @Property({ onCreate: () => new Date(), nullable: true })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  email!: string;

  // @Property({ type: Boolean })
  // approve!: boolean;
  @Property()
  loginAttempt!: number;

  constructor() {
    this.id = uuidv4();
  }
}
