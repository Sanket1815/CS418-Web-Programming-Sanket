import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  adminapproval,
  createAdminRequest,
  getAdminRequests,
  deleteAdminRecord,
} from './admin.service';
import { StudentType } from './admin.type';
import {
  AdminApproveParams,
  AdminParams,
  DeleteRecordParams,
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

  // @Mutation(() => Boolean)
  // async DeleteUserRecord(
  //   @Args('input') input: DeleteRecordParams,
  // ): Promise<Boolean> {
  //   return deleteAdminRecord(input);
  // }
}
