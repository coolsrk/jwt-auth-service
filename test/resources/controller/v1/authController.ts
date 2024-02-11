export const mockUserDataWithAuthInfo = {
  userId: 'a389eed4-1030-413d-af47-d11bee952498',
  name: 'test',
  lastName: 'test',
  email: 'test1234@gmail.com',
  mobNo: 1234567890,
  address: 'test',
  createdAt: new Date('2024-01-21T15:25:12.431Z'),
  updatedAt: new Date('2024-01-21T15:25:12.431Z'),
  password: {
      id: '77324a92-94e1-4d34-9efa-c9bee82ac087',
      userId: 'a389eed4-1030-413d-af47-d11bee952498',
      password: '$2b$10$MCG7rTFsAcDLNa5E5heakegcKX4gGPDDD9oKoV.23EYRLhhu03fHy',
      createdAt: new Date('2024-01-21T15:25:12.517Z'),
      updatedAt: new Date('2024-01-21T15:25:12.517Z')
  },
};

export const mockRefreshTokenInfo = {
  refreshToken: 'test',
  userId: 'test',
  roleId: 1,
  expiryTime: new Date(),
  createdAt: new Date('2024-01-21T15:25:12.517Z'),
  updatedAt: new Date('2024-01-21T15:25:12.517Z')
};
