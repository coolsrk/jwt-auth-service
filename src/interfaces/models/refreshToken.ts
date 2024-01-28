export interface RefreshTokenInterface {
  userId: string;
  tokenId : string;
  refreshToken: string;
  expiryTime: string;
  password?: string;
}
