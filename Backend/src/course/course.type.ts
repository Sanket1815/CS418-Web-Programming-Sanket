import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class PrerequisitiesType {
  @Field(() => String)
  id!: string;

  @Field(() => String, { nullable: true })
  prerequisites?: string;
}

@ObjectType()
export class CourseType {
  @Field(() => String)
  id!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  @Field(() => String)
  courseName!: string;

  @Field(() => String)
  level!: string;

  @Field(() => String, { nullable: true })
  department?: string;

  @Field(() => [PrerequisitiesType], { nullable: true })
  prerequisites?: PrerequisitiesType[];
}
