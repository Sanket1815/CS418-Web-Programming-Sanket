import { Injectable } from '@nestjs/common';
//import { Errors } from 'molecular';
import { User } from './user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager, MikroORM } from '@mikro-orm/core';
import {
  UserAddParams,
  UserUpdateParams,
  LoginParams,
  VerifyTokenParams,
  PasswordResetParams,
  GetSingleUserParams,
  EmailOTPParams,
  VerifyOtpParams,
} from './user.params';
import {
  createAdminRequest,
  adminapproval,
  deleteAdminRecord,
} from '../admin/admin.service';
import * as bcrypt from 'bcrypt';
import { Admin } from '../admin/admin.entity';
import { getEntityManager } from '../app.controller';
import { EmailDomain } from '../enums/emaildomain';
import { generateToken, TokenPayload, verifyToken } from '../auth.service';
import { sendOTPEmail } from '../emailservices/emailotpPassword';
import { sendLoginEmail } from '../emailservices/email.service';
import { LoginResponse, UserType } from './user.type';

export async function createUser(data: UserAddParams): Promise<String> {
  const em = await getEntityManager();
  const users = new User();
  let response: string;
  const user = await em.getRepository(User).findOne({ email: data.email });
  if (user) {
    response = 'Email already exists';
    throw new Error('Email already exists');
  }
  //const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(data.password, 10);
  const verifyEmail = Object.values(EmailDomain);
  if (
    !verifyEmail.some((verifiedEmail) => data.email.includes(verifiedEmail))
  ) {
    //console.log(verifyEmail);
    response = 'Please enter a vaild email address';
  } else {
    users.name = data.name;
    users.email = data.email;
    users.password = hashPassword;
    users.address = data.address ? data.address : data.address;
    users.isAdmin = data.isAdmin ? data.isAdmin : users.isAdmin;
    await em.persistAndFlush(users);
    response = 'User created Successfully';
    //console.log('response', response);
    //return response;
  }
  return response;
}

export async function getUsers(): Promise<UserType[]> {
  const em = await getEntityManager();
  const userList = await em.getRepository(User).find(User, {});
  return userList;
}

export async function getuser(data: GetSingleUserParams): Promise<UserType> {
  const em = await getEntityManager();
  const user = await em.getRepository(User).findOne({ email: data.email });
  return user;
}

export async function updateUser(data: UserUpdateParams): Promise<boolean> {
  const em = await getEntityManager();
  const users = await em.findOne(User, { id: data.id });
  const updateUser: User = users;
  updateUser.name = data.name ? data.name : updateUser.name;
  updateUser.mobileNumber = data.mobileNumber
    ? data.mobileNumber
    : updateUser.mobileNumber;
  updateUser.address = data.address ? data.address : updateUser.address;
  updateUser.lastName = data.lastName ? data.lastName : updateUser.lastName;
  updateUser.isAdmin = data.isAdmin ? data.isAdmin : updateUser.isAdmin;

  await em.persistAndFlush(updateUser);

  return !!updateUser;
}

export async function login(input: LoginParams): Promise<LoginResponse> {
  let response: LoginResponse;
  const em = await getEntityManager();
  console.log(input.email);
  const user: User = await em
    .getRepository(User)
    .findOne({ email: input.email });
  // const checkApproval: Admin[] = await em.getRepository(Admin).findOne({email:input.email});
  let data = {
    email: input.email,
    approve: false,
  };
  if (user) {
    const payload: TokenPayload = {
      id: user.id,
      email: input.email,
      password: input.password,
    };
    const match = await bcrypt.compare(input.password, user.password);
    if (match) {
      const checkApproval: Admin = await em
        .getRepository(Admin)
        .findOne({ email: input.email });
      if (!!user.isAdmin) {
        const token = await generateToken(payload);
        user.token = token;
        await em.persistAndFlush(user).then(async () => {
          await deleteAdminRecord(user.email);
          response = {
            message: 'Successfully LoggedIn',
            token: token ? token : null,
            isAdmin: user.isAdmin,
          };
        });
      } else if (checkApproval?.loginAttempt == 1) {
        response = {
          message: 'Approval pending! Try after some time',
          token: null,
          isAdmin: false,
        };
        //return { message: 'Approval pending! Try after some time' };
      } else if (checkApproval?.loginAttempt == 2) {
        const token = await generateToken(payload);
        user.token = token;
        await em.persistAndFlush(user).then(async () => {
          await sendLoginEmail(user.email, user.name, token);
          await deleteAdminRecord(user.email);
          response = {
            message: 'Successfully LoggedIn',
            token: token ? token : null,
            isAdmin: user.isAdmin,
          };
          // console.log(`token ${token} and ${response.token}`);
          // return { message: 'Successfully LoggedIn', token };
          //await deleteAdminRecord(user.email);
        });
        //await sendLoginEmail(user.email, user.name, token);
      } else {
        //console.log(`A`, createAdminRequest(data));
        const pendingUser = await createAdminRequest(data);
        if (pendingUser) {
          response = {
            message: 'Wait for Approval! Try after some time',
            token: null,
            isAdmin: false,
          };
          //return { message: 'Wait for Approval! Try after some time' };
        }
      }
    } else {
      response = {
        message: 'Incorrect Password',
        token: null,
        isAdmin: false,
      };
      //return { message: 'Incorrect Password' };
    }
  } else {
    response = {
      message: 'User Not Found',
      token: null,
      isAdmin: false,
    };
    //return { message: 'User Not Found' };
  }
  //console.log(`Response ${JSON.stringify(response)}`);
  return response;
  // console.log(response);
  // return response;
}

export async function verifyUserToken(
  data: VerifyTokenParams,
): Promise<String> {
  let response: string;
  const em = await getEntityManager();
  const email = await verifyToken(data.token);
  const userToken = await em.getRepository(User).findOne({ email: email });
  if (!userToken) {
    throw new Error('User not found');
  } else if (userToken.token == data.token) {
    response = userToken.email;
  } else {
    response = 'Invalid Token';
  }
  return response;
}

export async function passwordReset(
  data: PasswordResetParams,
): Promise<string> {
  const em = await getEntityManager();
  let response: string;
  const getUser = await em.getRepository(User).findOne({ email: data.email });
  if (!getUser) {
    response = 'User not found';
    throw new Error('User not found');
  } else if (data.password == data.confirmPassword) {
    const updatePassword: User = getUser;
    updatePassword.password = data.password
      ? await bcrypt.hash(data.password, 10)
      : updatePassword.password;
    //const hashPassword = await bcrypt.hash(data.password, 10);
    await em.persistAndFlush(getUser);
    response = 'Password Changed';
  } else {
    response = 'Password did not matched';
  }
  return response;
}

export async function emailOTP(data: EmailOTPParams): Promise<string> {
  const em = await getEntityManager();
  let response: string;
  const user: User = await em
    .getRepository(User)
    .findOne({ email: data.email });
  if (!user) {
    response = 'User Not Found';
  } else {
    const otp = Math.floor(Math.random() * 90000) + 10000;
    await sendOTPEmail(user.email, user.name, otp);
    user.otp = otp;
    await em.persistAndFlush(user);
    response = 'OTP Send';
  }
  return response;
}

export async function verifyOTP(data: VerifyOtpParams): Promise<boolean> {
  const em = await getEntityManager();
  const user: User = await em
    .getRepository(User)
    .findOne({ email: data.email });
  if (!user) {
    throw new Error('User not Found');
  }
  if (data.otp === user.otp) {
    return true;
  }
  return false;
}

@Injectable()
export class UserService {
  async createUser(data: UserAddParams) {
    return createUser(data);
  }

  async getUsers() {
    return getUsers();
  }

  async updateUser(data: UserUpdateParams) {
    return updateUser(data);
  }

  async login(data: LoginParams) {
    return login(data);
  }
  async verfiyToken(data: VerifyTokenParams) {
    return verifyUserToken(data);
  }

  async getUser(data: GetSingleUserParams) {
    return getuser(data);
  }

  async emailOtp(data: EmailOTPParams) {
    return emailOTP(data);
  }

  async verifyOtp(data: VerifyOtpParams) {
    return verifyOTP(data);
  }

  async passwordReset(data: PasswordResetParams) {
    return passwordReset(data);
  }
}
