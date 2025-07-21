import { z } from 'zod';

export const ChangePasswordSchema = z.object({
  password: z
    .string()
    .min(6, 'Password at least 6 characters')
    .max(35, 'Password max length 35 characters'),
});
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;
