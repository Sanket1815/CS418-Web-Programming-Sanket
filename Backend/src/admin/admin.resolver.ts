import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  adminapproval,
  createAdminRequest,
  getAdminRequests,
  deleteAdminRecord,
  verifyCapatcha,
} from './admin.service';
import { StudentType } from './admin.type';
import {
  AdminApproveParams,
  AdminParams,
  VerifyRecapchaParams,
} from './admin.params';
import { Admin } from './admin.entity';
import { EntityManager } from '@mikro-orm/core';

let em: EntityManager;
@Resolver()
export class AdminResolver {
  //constructor(private studentService: AdminService) {}

  @Query(() => [StudentType])
  async getAdminRequests(): Promise<Admin[]> {
    return getAdminRequests();
  }

  @Mutation(() => Boolean)
  async createAdminRequest(
    @Args('input') input: AdminParams,
  ): Promise<Boolean> {
    return createAdminRequest(input);
  }

  @Mutation(() => Boolean)
  async approveRequest(
    @Args('input') input: AdminApproveParams,
  ): Promise<Boolean> {
    return adminapproval(input);
  }

  @Mutation(() => Boolean)
  async verifyReCapacha(
    @Args('input') input: VerifyRecapchaParams,
    // other arguments
  ): Promise<boolean> {
    const isCaptchaValid = await verifyCapatcha(input);
    console.log(`cap ${isCaptchaValid}`);
    if (!isCaptchaValid) {
      throw new Error('Invalid CAPTCHA.');
    }
    return isCaptchaValid;
  }
}
