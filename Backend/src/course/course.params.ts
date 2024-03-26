import { InputType, Field, ID } from '@nestjs/graphql';
import * as jf from 'joiful';

@InputType()
export class AddPrerequisities {
  @Field(() => String)
  @jf.string().required()
  id!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  prerequisites?: string;
}

@InputType()
export class AddCourseParams {
  @Field(() => String)
  @jf.string().required()
  courseName!: string;

  @Field(() => String)
  @jf.string().required()
  level!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  department?: string;

  @Field(() => [AddPrerequisities], { nullable: true })
  @jf.array().optional()
  prerequisites?: Array<AddPrerequisities>;
}

@InputType()
export class UpdateCourseParams {
  @Field(() => String)
  @jf.string().required()
  id!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  courseName!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  level!: string;

  @Field(() => String, { nullable: true })
  @jf.string().optional()
  department?: string;

  @Field(() => [AddPrerequisities], { nullable: true })
  @jf.array().optional()
  prerequisites?: Array<AddPrerequisities>;
}

@InputType()
export class GetCourseParams {
  @Field(() => String)
  @jf.string().required()
  id!: string;
}

@InputType()
export class RemovePrerequisitesParams {
  @Field(() => String)
  @jf.string().required()
  courseId!: string;

  @Field(() => String)
  @jf.string().required()
  id!: string;
}
