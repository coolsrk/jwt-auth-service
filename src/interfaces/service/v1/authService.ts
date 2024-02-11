import RefreshToken from '../../../models/refreshToken';
import { LoginResponse } from '../../response';

export interface AuthServiceInterface {
  isUserAuthenticated(email: string, password: string): Promise<boolean>;
  generateJwtToken(email: string, userId: string, roleId: number): Promise<LoginResponse>;
  isRefeshTokenExpired(expiryTime:string): boolean;
  getRefreshTokenInfo(refreshToken: string): Promise<RefreshToken | null>;
}
