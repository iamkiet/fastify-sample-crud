export enum IdentityProvider {
  APP = 'app',
  GOOGLE = 'google',
  AUTH0 = 'auth0',
}

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identityProvider: IdentityProvider;
  createdAt: Date;
  updatedAt: Date;
  validatePassword(password: string): Promise<boolean>;
}

export interface CreateUser {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  identityProvider: IdentityProvider;
}

export interface UpdateUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface UserProfile extends Omit<User, 'password' | 'validatePassword'> {}

export interface GetUsersQuery {
  page: number;
  limit: number;
  search?: string;
}
