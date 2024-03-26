import { ObjectType, Field, ID } from '@nestjs/graphql';
import { AdvisoryRecordType } from '../course/advisoryRecord/advisoryRecord.type';

@ObjectType()
export class UserType {
  @Field(() => String)
  id: string;

  @Field({ defaultValue: Date })
  createdAt: Date;

  @Field({ defaultValue: Date })
  updatedAt: Date;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  email!: string;

  @Field(() => String)
  password!: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field({ nullable: true })
  mobileNumber?: number;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  isAdmin?: boolean;

  @Field({ nullable: true })
  otp?: number;

  @Field({ nullable: true })
  about?: string;

  @Field(() => [AdvisoryRecordType], { nullable: true })
  advisoryRecords!: AdvisoryRecordType[];
}

@ObjectType()
export class LoginResponse {
  @Field(() => String)
  message!: string;

  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => Boolean)
  isAdmin?: boolean;
}
