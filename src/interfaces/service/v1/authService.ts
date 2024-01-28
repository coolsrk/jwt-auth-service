import { LoginResponse } from '../../response';

export interface AuthServiceInterface {
  isUserAuthenticated(email: string, password: string): Promise<boolean>;
  generateJwtToken(email: string): LoginResponse;
}
