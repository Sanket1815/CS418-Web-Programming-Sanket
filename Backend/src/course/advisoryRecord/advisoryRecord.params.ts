import { InputType, Field, ID } from '@nestjs/graphql';
import * as jf from 'joiful';

@InputType()
export class StudentCoursesParams {
  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  courseName?: string;
}

@InputType()
export class StudentPrequisitesParams {
  @Field({ nullable: true })
  level?: string;

  @Field({ nullable: true })
  courseName?: string;
}

@InputType()
export class AdvisoryRecordParams {
  @Field()
  id!: string;

  @Field({ nullable: true })
  term!: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  gpa?: string;

  @Field({ nullable: true })
  lastTerm!: string;

  @Field(() => [StudentCoursesParams], { nullable: true })
  courses?: Array<StudentCoursesParams>;

  @Field(() => [StudentPrequisitesParams], { nullable: true })
  prerequisites?: Array<StudentPrequisitesParams>;
  //   @ManyToOne(() => User)
  //   user?: User;
  //   @ManyToOne(() => User)
  //   user?: User;
}

@InputType()
export class UpdateStudentStatusParams {
  @Field(() => String)
  @jf.string().required()
  id!: string;

  @Field(() => String)
  @jf.string().required()
  status!: string;
}
