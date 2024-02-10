declare namespace Express {
  interface Request{
    user: {
      email: string;
      userId: string;
      type: string;
    }
  }
}
