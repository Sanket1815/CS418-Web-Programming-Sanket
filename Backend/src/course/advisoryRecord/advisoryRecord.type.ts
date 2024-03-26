import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StudentCoursesType {
  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  courseName?: string;
}

@ObjectType()
export class StudentPrequisitesType {
  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  courseName?: string;
}

@ObjectType()
export class AdvisoryRecordType {
  @Field(() => String)
  id: string;

  @Field({ defaultValue: Date })
  createdAt: Date;

  @Field({ defaultValue: Date })
  updatedAt: Date;

  @Field({ nullable: true })
  term!: string;

  @Field({ nullable: true })
  status!: string;

  @Field({ nullable: true })
  gpa?: string;

  @Field({ nullable: true })
  lastTerm!: string;

  @Field(() => [StudentCoursesType], { nullable: true })
  courses?: Array<StudentCoursesType>;

  @Field(() => [StudentPrequisitesType], { nullable: true })
  prerequisites?: Array<StudentPrequisitesType>;
  //   @ManyToOne(() => User)
}
