import { User } from './User';

export class VerificationCode {
  id!: number;
  userId!: number;
  code!: string;
  email?: string; // Add email field for verification requests
  expiresAt!: Date;
  isUsed!: boolean;
  createdAt!: Date;
  user?: User;
}
