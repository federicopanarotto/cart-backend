import { UserIdentityModel } from "../../lib/auth/local/user-identity.model";
import { User } from "./user.entity";
import { UserModel } from "./user.model";
import bcrypt from 'bcrypt';

export class UserExistError extends Error {
  constructor() {
    super();
    this.name = 'UserExits';
    this.message = 'Username already in use';
  }
}

export class UserService {
  async add(user: User, credentials: { username: string, password: string }): Promise<User> {
    const existingUser = await UserIdentityModel.findOne({ 'credentials.username': credentials.username });
  
    if (existingUser) {
      throw new UserExistError();
    }
  
    const newUser = await UserModel.create(user);
  
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
  
    await UserIdentityModel.create({
      provider: 'local',
      user: newUser.id,
      credentials: {
        username: credentials.username,
        hashedPassword: hashedPassword
      }
    });
  
    return newUser;
  }
}

export default new UserService();
