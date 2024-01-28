export interface UserRegistrationRequest {
  firstName: string;
  lastName?: string;
  password: string;
  confirmPassword: string;
  mobileNo?: number;
  email: string;
  address?: string;
}