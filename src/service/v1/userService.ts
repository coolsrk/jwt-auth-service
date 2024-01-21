import { PasswordInterface, SaltInterface } from '../../interfaces/models';
import { UserRegistrationRequest } from '../../interfaces/request';
import { UserServiceInterface } from '../../interfaces/service/v1';
import Password from '../../models/password';
import User from '../../models/user';
import {v4} from 'uuid';
import bcrypt from 'bcrypt';
import Salt from '../../models/salt';
import { Logger } from '../../lib/logger/logger';
import { UserRegistrationResponse } from '../../interfaces/response/userRegistrationResponse';

export class UserService implements UserServiceInterface {
  public logger: Logger;

  constructor(logger: Logger){
    this.logger = logger;
  }
  
  public async createUser(userInfo: UserRegistrationRequest): Promise<UserRegistrationResponse> {
    try {
      const userId = v4();
      const {salt, password} = this.generatePasswordHash(userInfo.password);
      await User.create({
        userId,
        name: userInfo.firstName,
        lastName: userInfo?.lastName,
        mobNo: userInfo?.mobileNo,
        email: userInfo.email,
        address: userInfo.address,
        password:{
          password: password
        } as PasswordInterface,
        salt: {
          salt
        } as SaltInterface
      },
      {
        include : [{model: Password }, {model: Salt}]
      });
      this.logger.info('User registered successfully!');

      return {
        firstName: userInfo.firstName,
        lastName: userInfo?.lastName,
        mobileNo: userInfo?.mobileNo,
        email: userInfo.email,
        address: userInfo.address,
      };
    } catch (error: unknown) {
       throw new Error(`Error while registering user:${error instanceof Error 
        ? error.message : JSON.stringify(error) }`);
    }
  }

  public generatePasswordHash(password: string): {salt: string, password: string} {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordHash = bcrypt.hashSync(password, salt);
    return {salt, password:passwordHash};
  }

  public async findUserByEmail(email: string): Promise<User | null> {
    const user = await User.findOne({where: {email: email}});
    return user;
  }
}