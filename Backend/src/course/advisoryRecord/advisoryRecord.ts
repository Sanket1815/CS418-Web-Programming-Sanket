import { Injectable } from '@nestjs/common';
import { AdvisoryRecord } from './advisoryRecords.entity';
import { User } from '../../user/user.entity';
import {
  AdvisoryRecordParams,
  UpdateStudentStatusParams,
} from './advisoryRecord.params';
//import { CourseType } from './course.type';
import { getEntityManager } from '../../app.controller';
import { sendStatusUpdate } from '../../emailservices/email.statusUpdate';

// export async function AddUserAdvisoryRecord(
//   data: AdvisoryRecordParams,
// ): Promise<string> {
//   const em = await getEntityManager();
//   let response: string;
//   const records = new AdvisoryRecord();
//   const user: User = await em
//     .getRepository(User)
//     .findOne({ id: data.id }, { populate: ['advisoryRecords'] });
//   if (!user) {
//     throw new Error('User does not exists');
//   } else {
//     //console.log(`course`, records);
//     records.term = data.term;
//     records.lastTerm = data.lastTerm;
//     records.gpa = data.gpa;
//     records.status = 'Pending';
//     records.courses = data.courses.map((x) => {
//       return {
//         level: x.level,
//         courseName: x.courseName,
//       };
//     });
//     records.prerequisites = data.prerequisites.map((e) => {
//       return {
//         level: e.level,
//         courseName: e.courseName,
//       };
//     });
//     user.advisoryRecords.add(records);
//     await em.persistAndFlush(records);
//     response = 'Record inserted successfully';
//   }

//   return response;
// }
export async function AddUserAdvisoryRecord(
  data: AdvisoryRecordParams,
): Promise<string> {
  const em = await getEntityManager();
  const records: AdvisoryRecord = new AdvisoryRecord();
  const user: User = await em
    .getRepository(User)
    .findOne({ id: data.id }, { populate: ['advisoryRecords'] });

  if (!user) {
    throw new Error('User does not exist');
  }

  // Gather existing course names from approved records
  const existingCourseNames = new Set<string>();
  user.advisoryRecords.getItems().forEach((record) => {
    if (record.status === 'Approved') {
      record.courses.forEach((course) => {
        existingCourseNames.add(course.courseName);
      });
    }
  });

  // Filter out unique courses and track duplicates
  const uniqueCourses = [];
  let duplicateCourseNames = '';
  for (const course of data.courses) {
    if (existingCourseNames.has(course.courseName)) {
      duplicateCourseNames += `${course.courseName}, `;
    } else {
      uniqueCourses.push(course);
    }
  }

  // Check if there are any unique courses to add
  if (uniqueCourses.length === 0) {
    return `No unique courses to add. Duplicate courses: ${duplicateCourseNames.slice(
      0,
      -2,
    )}`;
  }

  // Add unique courses to the record
  records.term = data.term;
  records.lastTerm = data.lastTerm;
  records.gpa = data.gpa;
  records.status = 'Pending';
  records.courses = uniqueCourses.map((x) => ({
    level: x.level,
    courseName: x.courseName,
  }));
  records.prerequisites = data.prerequisites.map((e) => ({
    level: e.level,
    courseName: e.courseName,
  }));

  user.advisoryRecords.add(records);
  await em.persistAndFlush(records);

  let response = 'Record inserted successfully';
  if (duplicateCourseNames) {
    response += `. Note: You have already completed - ${duplicateCourseNames.slice(
      0,
      -2,
    )}`;
  }
  return response;
}

export async function updateStudentStatus(
  data: UpdateStudentStatusParams,
): Promise<boolean> {
  const em = await getEntityManager();
  const record: AdvisoryRecord = await em
    .getRepository(AdvisoryRecord)
    .findOne({ id: data.id });
  const users: User = await em
    .getRepository(User)
    .findOne({ id: record.user.id });
  if (!users) {
    throw new Error(`User not found`);
  }
  if (!record) {
    throw new Error(`Record not found`);
  }
  const studentRecord: AdvisoryRecord = record;
  studentRecord.status =
    data.status === 'Approved'
      ? 'Approved'
      : data.status === 'Rejected'
      ? 'Rejected'
      : 'Pending';

  await em.persistAndFlush(studentRecord).then(async () => {
    if (studentRecord.status == 'Approved') {
      console.log(`11`, users);
      console.log(`22`, users.email);
      await sendStatusUpdate(
        users.email,
        users.name,
        studentRecord.term,
        studentRecord.status,
      );
    } else if (studentRecord.status == 'Rejected') {
      await sendStatusUpdate(
        users.email,
        users.name,
        studentRecord.term,
        studentRecord.status,
      );
    }
  });
  return !!studentRecord;
}
