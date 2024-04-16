import { getEntityManager } from '../../app.controller';
import bcrypt from 'bcrypt';
import { generateToken, TokenPayload } from '../../auth.service';
import { login } from '../user.service';
import { User } from '../user.entity';
import { Admin } from '../../admin/admin.entity';
import { boolean } from 'joiful';
//import { LoginResponse } from '../dto/loginResponse.dto';

jest.mock('@mikro-orm/postgresql');
jest.mock('bcrypt', () => ({
  ...jest.requireActual('bcrypt'),
  hash: jest.fn().mockResolvedValue('TestUser123!'),
  compare: jest.fn().mockResolvedValue(false),
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
jest.mock('../../auth.service');

describe('login', () => {
  let mockUser;
  let mockAdmin;
  let mockPayload;
  let mockToken;
  beforeEach(async () => {
    jest.clearAllMocks();
    // });

    mockUser = {
      id: '1',
      email: 'test@example.com',
      password: await bcrypt?.hash('TestUser123!', 10),
      name: 'Test User',
      isAdmin: false,
    };

    mockAdmin = {
      email: 'test@example.com',
      loginAttempt: 1,
    };

    mockPayload = {
      id: mockUser.id,
      email: mockUser.email,
      password: 'TestUser123!',
    };

    mockToken = 'jwt_token_mock';
  });

  it('should return "User Not Found" when the user does not exist', async () => {
    (getEntityManager as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    });

    const result = await login({
      email: 'nonexistent@example.com',
      password: 'TestUser123!',
    });

    expect(result).toEqual({
      message: 'User Not Found',
      token: null,
      isAdmin: false,
    });
  });

  it('should return "Incorrect Password" when the password is incorrect', async () => {
    (getEntityManager as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      }),
    });
    (bcrypt?.compare as jest.Mock)?.mockResolvedValue(false);

    const result = await login({
      email: mockUser.email,
      password: 'wrong_password',
    });

    expect(result).toEqual({
      message: 'Incorrect Password',
      token: null,
      isAdmin: false,
    });
  });

  // it('should return "Approval pending! Try after some time" when the user has a pending approval', async () => {
  //   (getEntityManager as jest.Mock).mockResolvedValue({
  //     getRepository: jest.fn().mockReturnValue({
  //       findOne: jest
  //         .fn()
  //         .mockImplementation((options) =>
  //           options.email === User.name ? mockUser : mockAdmin,
  //         ),
  //     }),
  //   });
  //   (bcrypt?.compare as jest.Mock)?.mockResolvedValue(true);
  //   (generateToken as jest.Mock).mockResolvedValue(mockToken);

  //   const result = await login({
  //     email: mockUser.email,
  //     password: 'TestUser123!',
  //   });

  //   expect(result).toEqual({
  //     message: 'Approval pending! Try after some time',
  //     token: null,
  //     isAdmin: false,
  //   });
  // });
  // it('should return "Approval pending! Try after some time" when the user has a pending approval', async () => {
  //   (getEntityManager as jest.Mock).mockResolvedValue({
  //     getRepository: jest.fn().mockImplementation((entityType) => {
  //       if (entityType === User) {
  //         return {
  //           findOne: jest.fn().mockResolvedValue(mockUser),
  //         };
  //       } else if (entityType === Admin) {
  //         return {
  //           findOne: jest.fn().mockResolvedValue(mockAdmin),
  //         };
  //       }
  //       return {
  //         findOne: jest.fn().mockResolvedValue(null),
  //       };
  //     }),
  //   });
  //   (bcrypt?.compare as jest.Mock)?.mockResolvedValue(true); // Override bcrypt compare for this specific test

  //   const result = await login({
  //     email: mockUser.email,
  //     password: 'TestUser123!',
  //   });

  //   expect(result).toEqual({
  //     message: 'Approval pending! Try after some time',
  //     token: null,
  //     isAdmin: false,
  //   });
  // });

  // Add more test cases for other scenarios as needed
});
