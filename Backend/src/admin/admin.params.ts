import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class AdminParams {
  @Field(() => String)
  email!: string;

  @Field(() => Boolean)
  approve!: boolean;
}

@InputType()
export class AdminApproveParams {
  @Field(() => String)
  email!: string;

  // @Field(() => Number)
  // loginAttempt!: number;
}

@InputType()
export class DeleteRecordParams {
  @Field(() => String)
  email!: string;
}

@InputType()
export class VerifyRecapchaParams {
  @Field(() => String)
  token!: string;
}
