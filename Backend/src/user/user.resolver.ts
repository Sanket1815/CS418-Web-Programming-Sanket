import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import {
  createUser,
  getUsers,
  login,
  updateUser,
  verifyUserToken,
  passwordReset,
  getuser,
  emailOTP,
  verifyOTP,
} from './user.service';
import { UserType, LoginResponse } from './user.type';
import {
  UserAddParams,
  UserUpdateParams,
  LoginParams,
  VerifyTokenParams,
  PasswordResetParams,
  GetSingleUserParams,
  EmailOTPParams,
  VerifyOtpParams,
} from './user.params';
import { User } from './user.entity';
import { EntityManager } from '@mikro-orm/core';

let em: EntityManager;

@Resolver()
export class UserResolver {
  // constructor(private userService: UserService) {}

  @Query(() => [UserType])
  async getUser(): Promise<UserType[]> {
    return getUsers();
  }

  @Mutation(() => String)
  async createUser(@Args('input') input: UserAddParams): Promise<String> {
    return createUser(input);
  }

  @Mutation(() => Boolean)
  async updateUser(@Args('input') input: UserUpdateParams): Promise<Boolean> {
    return updateUser(input);
  }

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginParams): Promise<LoginResponse> {
    // const response: Response = context.req; // Get the HTTP response object
    // console.log(`response ${JSON.stringify(response.headers)}`);
    return login(input);
  }

  @Mutation(() => String)
  async verifyToken(@Args('input') input: VerifyTokenParams): Promise<String> {
    return verifyUserToken(input);
  }

  @Mutation(() => String)
  async passwordReset(
    @Args('input') input: PasswordResetParams,
  ): Promise<String> {
    return passwordReset(input);
  }

  @Query(() => UserType)
  async getSingleUser(
    @Args('input') input: GetSingleUserParams,
  ): Promise<UserType> {
    return getuser(input);
  }

  @Mutation(() => String)
  async sendEmailOtp(@Args('input') input: EmailOTPParams): Promise<String> {
    return emailOTP(input);
  }

  @Mutation(() => Boolean)
  async verifyOtp(@Args('input') input: VerifyOtpParams): Promise<Boolean> {
    return verifyOTP(input);
  }
}
