import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  password: z.string().min(6, 'Password at least 6 characters'),
});
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
