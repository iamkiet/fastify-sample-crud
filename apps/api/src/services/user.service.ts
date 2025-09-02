import { UserRepository } from '@/repositories/user.repository';
import { User, CreateUser, UpdateUser, UserProfile, GetUsersQuery } from '@repo/shared';
import { PaginationResult } from '@/types/common.types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(userData: CreateUser): Promise<UserProfile> {
    const user = await this.userRepository.create(userData);
    const { password, ...userProfile } = user;
    return userProfile;
  }

  async getUsers(query: GetUsersQuery): Promise<PaginationResult<UserProfile>> {
    const { users, total } = await this.userRepository.findAll(query);
    const pages = Math.ceil(total / query.limit);

    const userProfiles = users.map(user => {
      const { password, ...userProfile } = user;
      return userProfile;
    });

    return {
      data: userProfiles,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        pages,
      },
    };
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;
    
    const { password, ...userProfile } = user;
    return userProfile;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async updateUser(id: string, userData: UpdateUser): Promise<UserProfile | null> {
    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) return null;
    
    const { password, ...userProfile } = updatedUser;
    return userProfile;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }
}

export const userService = new UserService();