import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import {
  AddCourseParams,
  UpdateCourseParams,
  GetCourseParams,
  RemovePrerequisitesParams,
} from './course.params';
import {
  createCourse,
  updateCourse,
  getCourses,
  getCourse,
  removePrerequisites,
} from './course.service';
import { CourseType } from './course.type';

@Resolver()
export class CourseResolver {
  // constructor(private userService: UserService) {}

  @Query(() => [CourseType])
  async getCourses(): Promise<CourseType[]> {
    console.log(getCourses);
    return getCourses();
  }

  @Mutation(() => String)
  async createCourse(@Args('input') input: AddCourseParams): Promise<String> {
    return createCourse(input);
  }

  @Mutation(() => String)
  async updateCourse(
    @Args('input') input: UpdateCourseParams,
  ): Promise<String> {
    return updateCourse(input);
  }

  @Query(() => CourseType)
  async getCourse(@Args('input') input: GetCourseParams): Promise<CourseType> {
    //console.log(getCourses);
    return getCourse(input);
  }

  @Mutation(() => Boolean)
  async removePrerequisites(
    @Args('input') input: RemovePrerequisitesParams,
  ): Promise<boolean> {
    return removePrerequisites(input);
  }
}
