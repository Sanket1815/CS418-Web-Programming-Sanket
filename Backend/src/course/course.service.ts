import { Injectable } from '@nestjs/common';
import { Course, Prerequisites } from './course.entity';
import {
  AddCourseParams,
  UpdateCourseParams,
  GetCourseParams,
  RemovePrerequisitesParams,
} from './course.params';
import { CourseType } from './course.type';
import { getEntityManager } from '../app.controller';

export async function createCourse(data: AddCourseParams): Promise<string> {
  const em = await getEntityManager();
  const courses = new Course();
  let response: string;
  const course = await em
    .getRepository(Course)
    .findOne({ courseName: data.courseName });
  if (course) {
    response = 'Course already exists';
    throw new Error('Course already exists');
  } else {
    courses.courseName = data.courseName;
    courses.level = data.level;
    courses.department = data.department;
    courses.prerequisites =
      data.prerequisites.map((course) => {
        return {
          id: course.id,
          prerequisites: course.prerequisites,
        };
      }) || [];
    await em.persistAndFlush(courses);
    response = 'Course created successfully';
  }

  return response;
}

export async function updateCourse(data: UpdateCourseParams): Promise<string> {
  const em = await getEntityManager();
  let response: string;
  const course = await em.getRepository(Course).findOne({ id: data.id });
  if (!course) {
    response = 'Course does not exists';
    throw new Error('Course does not exists');
  } else {
    const updateCourse: Course = course;
    updateCourse.courseName = data.courseName
      ? data.courseName
      : updateCourse.courseName;
    updateCourse.level = data.level ? data.level : updateCourse.level;
    updateCourse.department = data.department
      ? data.department
      : updateCourse.department;
    updateCourse.prerequisites = data.prerequisites
      ? data.prerequisites
      : updateCourse.prerequisites;
    await em.persistAndFlush(updateCourse);
    response = 'Updated SuccessFully';
  }
  return response;
}

export async function getCourses(): Promise<CourseType[]> {
  const em = await getEntityManager();
  const courses: CourseType[] = await em.getRepository(Course).findAll();
  //   let www = courses[0].prerequisites;
  //   console.log('www', JSON.stringify(www));
  //   const courseList = courses.map((x) => {
  //     return {
  //       id: x.id,
  //       createdAt: x.createdAt,
  //       updatedAt: x.updatedAt,
  //       courseName: x.courseName,
  //       level: x.level,
  //       department: x.department,
  //       prerequisites: x.prerequisites.map((e) => {
  //         return {
  //           id: e.id,
  //           prerequisites: e.prerequisites,
  //         };
  //       }),
  //     };
  //   });
  //   const courses = [
  //     {
  //       id: '1',
  //       createdAt: new Date('2024-02-27T06:23:51.000Z'),
  //       updatedAt: new Date('2024-02-27T06:23:51.000Z'),
  //       courseName: 'Test Course',
  //       level: '100',
  //       department: 'CS',
  //       prerequisites: [
  //         { id: '1', prerequisites: 'Dummy Data 1' },
  //         { id: '2', prerequisites: 'Dummy Data 2' },
  //       ],
  //     },
  //   ];
  //console.log(`course`, JSON.stringify(courses[0].prerequisites[0]));
  return courses;
}

export async function getCourse(data: GetCourseParams): Promise<CourseType> {
  const em = await getEntityManager();
  const course: CourseType = await em
    .getRepository(Course)
    .findOne({ id: data.id });
  if (!course) {
    throw new Error('Course Not Found');
  }
  return course;
}

export async function removePrerequisites(
  data: RemovePrerequisitesParams,
): Promise<boolean> {
  const em = await getEntityManager();
  const course = await em.getRepository(Course).findOne({ id: data.courseId });

  if (!course) {
    throw new Error('Course Not Found');
  }

  const updatedPrerequisites = course.prerequisites.filter(
    (prerequisite) => prerequisite.id !== data.id,
  );

  if (updatedPrerequisites.length === course.prerequisites.length) {
    throw new Error('Prerequisite Not Found');
  }

  // Update the prerequisites array and persist the course entity
  course.prerequisites = updatedPrerequisites;
  await em.persistAndFlush(course);

  return true;
}

@Injectable()
export class CourseService {
  async createCourse(data: AddCourseParams) {
    return createCourse(data);
  }

  async updateCourse(data: UpdateCourseParams) {
    return updateCourse(data);
  }

  async getCourses() {
    return getCourses();
  }

  async getCourse(data: GetCourseParams) {
    return getCourse(data);
  }
}
