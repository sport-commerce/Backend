import { User } from '../user';

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  save: (email: string, password: string) => Promise<User>;
}
