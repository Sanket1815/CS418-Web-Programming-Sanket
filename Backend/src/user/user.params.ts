import { InputType, Field, ID } from '@nestjs/graphql';
import * as jf from 'joiful';

@InputType()
export class UserAddParams {
  @Field(() => String)
  @jf.string().required()
  name!: string;

  @Field(() => String)
  @jf.string().email().required()
  email!: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String)
  @jf.string().required()
  password!: string;

  @Field(() => String, { nullable: true })
  mobileNumber?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Boolean, { defaultValue: false })
  isAdmin: boolean;
}

@InputType()
export class UserUpdateParams {
  @Field()
  @jf.string().required()
  id: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  name!: string;

  // @Field(() => String, { nullable: true })
  // @jf.string().email().optional()
  // email!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  address?: string;

  @Field(() => Number, { nullable: true })
  @jf.number().optional()
  mobileNumber?: number;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  lastName?: string;

  @Field(() => Boolean, { nullable: true })
  isAdmin?: boolean;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  about?: string;

  @Field(() => Number, { nullable: true })
  @jf.number().optional()
  otp?: number;
}

@InputType()
export class LoginParams {
  @Field(() => String)
  @jf.string().email().required()
  email!: string;

  @Field(() => String)
  @jf.string().required()
  password!: string;
}

@InputType()
export class VerifyTokenParams {
  @Field(() => String)
  @jf.string().required()
  token!: string;
}

@InputType()
export class PasswordResetParams {
  @Field(() => String)
  @jf.string().required()
  email!: string;

  @Field(() => String)
  @jf.string().required()
  password!: string;

  @Field(() => String)
  @jf.string().required()
  confirmPassword!: string;
}

@InputType()
export class GetSingleUserParams {
  @Field(() => String)
  @jf.string().required()
  email!: string;
}

@InputType()
export class EmailOTPParams {
  @Field(() => String)
  @jf.string().required()
  email!: string;
}

@InputType()
export class VerifyOtpParams {
  @Field(() => String)
  @jf.string().required()
  email!: string;

  @Field(() => Number)
  @jf.number().required()
  otp!: number;
}
