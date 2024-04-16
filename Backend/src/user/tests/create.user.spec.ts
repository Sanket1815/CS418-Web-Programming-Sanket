import { getEntityManager } from '../../app.controller';
import bcrypt from 'bcrypt';
import { createUser } from '../user.service';
import { User } from '../user.entity';
import { UserAddParams } from '../user.params';
import { createAdminRequest } from '../../admin/admin.service';
import { AdvisoryRecord } from '../../course/advisoryRecord/advisoryRecords.entity';
import { EmailDomain } from '../../enums/emaildomain';

jest.mock('@mikro-orm/postgresql');
// jest.mock('bcrypt', () => ({
//   hash: jest.fn(),
// }));
jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));
jest.mock('../../app.controller', () => ({
  getEntityManager: jest.fn().mockReturnValue({
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null), // or other appropriate mock return value
      // Add other methods as used in your service
    }),
    persistAndFlush: jest.fn().mockResolvedValue(undefined), // Mock persistAndFlush as a resolved promise
  }),
}));
jest.mock('../../admin/admin.service', () => ({
  __esModule: true,
  createAdminRequest: jest.fn().mockResolvedValue(undefined),
}));

describe('createUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserData: UserAddParams = {
    name: 'Test User',
    email: 'test@gmail.com',
    password: 'TestUser123!',
    address: '123 Test St',
    isAdmin: false,
    advisoryRecord: [],
  };

  const existingUser = {
    id: 1,
    email: 'existing@example.com',
  };

  it('should throw an error when the email already exists', async () => {
    (getEntityManager as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(existingUser),
      }),
    });

    const mockUserDataWithExistingEmail = {
      ...mockUserData,
      email: existingUser.email,
    };

    await expect(createUser(mockUserDataWithExistingEmail)).rejects.toThrow(
      'Email already exists',
    );
  });

  it('should throw an error when the password format is invalid', async () => {
    (getEntityManager as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });
    ((await bcrypt?.hash) as jest.Mock)?.mockResolvedValue('hashed_password');

    //(bcrypt.default.hash as jest.Mock).mockResolvedValue('hashed_password');

    const invalidMockUserData = { ...mockUserData, password: 'Testing123' };

    await expect(createUser(invalidMockUserData)).rejects.toThrow(
      'Invalid password format',
    );
  });

  it('should return a message when the email domain is invalid', async () => {
    (getEntityManager as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });
    (bcrypt?.hash as jest.Mock)?.mockResolvedValue('hashed_password');

    const invalidMockUserData = { ...mockUserData, email: 'test@invalid.com' };

    const result = await createUser(invalidMockUserData);
    expect(result).toBe('Please enter a vaild email address');
  });

  // it('should create a new user with advisory records', async () => {
  //   (getEntityManager as jest.Mock).mockResolvedValue({
  //     getRepository: jest.fn().mockReturnValue({
  //       findOne: jest.fn().mockResolvedValue(null),
  //     }),
  //     persistAndFlush: jest.fn().mockResolvedValue(undefined),
  //   });
  //   (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
  //   const createAdminRequestMock = jest.fn().mockResolvedValue(undefined);
  //   jest.mock('./createAdminRequest', () => createAdminRequestMock);

  //   const advisoryRecordData = [
  //     { term: 'Term 1', status: 'completed' },
  //     { term: 'Term 2', status: 'in_progress' },
  //   ];
  //   const mockUserDataWithAdvisoryRecords = {
  //     ...mockUserData,
  //     advisoryRecord: advisoryRecordData,
  //   };

  //   const result = await createUser(mockUserDataWithAdvisoryRecords);

  //   expect(result).toEqual('User created Successfully');
  //   expect(bcrypt.hash).toHaveBeenCalledWith('TestUser123!', 10);
  //   expect(getEntityManager).toHaveBeenCalledTimes(1);
  //   expect(createAdminRequestMock).toHaveBeenCalledWith({
  //     email: 'test@example.com',
  //     approve: false,
  //   });
  // });

  // Add more test cases for other scenarios as needed
});
