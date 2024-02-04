declare namespace Express {
  interface Request{
    user: {
      email: string;
      tokenId: string;
      userId: string;
    }
  }
}
