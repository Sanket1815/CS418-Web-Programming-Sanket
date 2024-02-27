import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Admin } from './admin.entity';
import { EntityRepository, EntityManager, MikroORM } from '@mikro-orm/core';
import {
  AdminParams,
  AdminApproveParams,
  DeleteRecordParams,
} from './admin.params';
import { getEntityManager } from '../app.controller';

// let entityManager = null;
// export const getEntityManager = async () => {
//   if (!entityManager) {
//     const orm = await MikroORM.init({
//       entities: [Admin],
//       dbName: 'nestjsreact',
//       type: 'mysql',
//       // ...other Mikro-ORM options
//     });

//     entityManager = orm.em;
//   }

//   return entityManager;
// };
// @Injectable()
// export class AdminService {
// constructor(
//   @InjectRepository(Admin)
//   private em: EntityManager,
// ) {}

export async function createAdminRequest(data: AdminParams): Promise<Boolean> {
  const em = await getEntityManager();
  const student = new Admin();
  const students = await em.getRepository(Admin).findOne({ email: data.email });
  if (students) {
    throw new Error('User Request pending');
  }
  // if (!students) {
  //   student.email = data.email;
  //   student.approve = data.approve;
  //   await em.persistAndFlush(student);
  // }
  student.email = data.email;
  student.loginAttempt = 1;
  await em.persistAndFlush(student);
  return true;
}

export async function getAdminRequests(): Promise<Admin[]> {
  const em = await getEntityManager();
  const RequestList = await em.find(Admin, { loginAttempt: { $eq: 1 } });
  return RequestList;
}

export async function deleteAdminRecord(email: string): Promise<boolean> {
  const em = await getEntityManager();
  const userEmail = await em.getRepository(Admin).findOne({ email: email });
  if (!userEmail) {
    throw new Error('Email not found');
  }
  await em.remove(userEmail).flush();
  return true;
}

export async function adminapproval(
  data: AdminApproveParams,
): Promise<boolean> {
  const em = await getEntityManager();
  const students = await em.findOne(Admin, { email: data.email });
  const updateAdmin: Admin = students;
  console.log('Login', students.loginAttempt);
  if (students.loginAttempt == 1) {
    updateAdmin.loginAttempt = students.loginAttempt + 1;
    await em.persistAndFlush(updateAdmin);
  }
  //console.log(data.approve);
  //updateAdmin.loginAttempt = data.loginAttempt++;
  // console.log(`1 ${updateAdmin.approve}`);

  // await em.persistAndFlush(updateAdmin);

  return !!updateAdmin;
}
//}

@Injectable()
export class AdminService {
  async createAdminRequest(data: AdminParams) {
    return createAdminRequest(data);
  }

  async getAdminRequests() {
    return getAdminRequests();
  }

  async adminapproval(data: AdminApproveParams) {
    return adminapproval(data);
  }

  async deleteUserRecord(email) {
    return deleteAdminRecord(email);
  }
}
