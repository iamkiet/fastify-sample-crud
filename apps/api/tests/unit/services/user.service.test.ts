import { userService } from '../../../src/services/user.service';
import { UserRepository } from '../../../src/repositories/user.repository';
import { CreateUser, User } from '../../../src/types/user.types';
import { PostgresDataSource } from '../../../src/config/data-source';

// Mock the UserRepository
jest.mock('../../../src/repositories/user.repository');

describe('UserService', () => {
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    (userService as any).userRepository = mockUserRepository;
  });

  describe('createUser', () => {
    it('should create a user with hashed password', async () => {
      const userData: CreateUser = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: userData.email,
        password: 'hashedPassword',
        firstName: userData.firstName,
        lastName: userData.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
        validatePassword: jest.fn(),
      } as User;

      mockUserRepository.create.mockResolvedValue(mockUser);

      const user = await userService.createUser(userData);

      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(user.email).toBe(userData.email);
      expect(user.firstName).toBe(userData.firstName);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.password).toBeUndefined(); // Password should be excluded
    });
  });

  describe('getUserById', () => {
    it('should return null for non-existent user', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      const user = await userService.getUserById('123e4567-e89b-12d3-a456-426614174000');
      
      expect(mockUserRepository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(user).toBeNull();
    });

    it('should return user profile without password', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date(),
        validatePassword: jest.fn(),
      } as User;

      mockUserRepository.findById.mockResolvedValue(mockUser);

      const user = await userService.getUserById('123e4567-e89b-12d3-a456-426614174000');
      
      expect(user).toBeDefined();
      expect(user?.password).toBeUndefined(); // Password should be excluded
      expect(user?.email).toBe(mockUser.email);
    });
  });
});