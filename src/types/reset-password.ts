import { z } from 'zod';

export enum ETokenResetCode {
  INVALID_TOKEN = "InvalidToken",
}

export enum ETokenReset {
  InvalidToken = 'Token is invalid',
}

export const ResetSchema = z.object({
  email: z.email('Incorrect email'),
});
export type ResetForm = z.infer<typeof ResetSchema>;

export const ResetTokenSchema = z.object({
  password: z.string().min(6, 'Password at least 6 characters'),
});
export type ResetTokenForm = z.infer<typeof ResetTokenSchema>;