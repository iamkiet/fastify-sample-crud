import { CreateUser } from '../../src/types/user.types';

export const testUsers: CreateUser[] = [
  {
    email: 'user1@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    email: 'user2@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
  },
];

export const testCredentials = {
  valid: {
    email: 'user1@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'nonexistent@example.com',
    password: 'wrongpassword',
  },
};