import { z } from 'zod';

export enum ELoginResponseCode {
  USER_NOT_FOUND = 'NotFound',
  INVALID_PASSWORD = 'IsNotValid',
  EMAIL_NOT_VERIFIED = 'NotVerified',
}

export enum ELoginResponseTypes {
  NotFound = 'User not found',
  IsNotValid = 'Incorrect password',
  NotVerified = 'Email is not verified',
}

export const LoginSchema = z.object({
  email: z.email('Incorrect email'),
  password: z
    .string()
    .min(6, 'Password at least 6 characters')
    .max(35, 'Password max length 35 characters'),
});
export type LoginForm = z.infer<typeof LoginSchema>;
