import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AddUserAdvisoryRecord, updateStudentStatus } from './advisoryRecord';
import { User } from '../../user/user.entity';
import {
  AdvisoryRecordParams,
  UpdateStudentStatusParams,
} from './advisoryRecord.params';

@Resolver()
export class AdvisoryRecordResolver {
  @Mutation(() => String)
  async createUserAdvisoryRecord(
    @Args('input') input: AdvisoryRecordParams,
  ): Promise<String> {
    return AddUserAdvisoryRecord(input);
  }

  @Mutation(() => Boolean)
  async updateUserAdvisoryStatus(
    @Args('input') input: UpdateStudentStatusParams,
  ): Promise<Boolean> {
    return updateStudentStatus(input);
  }
}
