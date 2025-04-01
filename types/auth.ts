export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  hasUsedService: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OTPVerification {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}
