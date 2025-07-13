import { z } from 'zod';

export const ResetTokenSchema = z.object({
  password: z.string().min(6, 'Password at least 6 characters'),
});
export type ResetTokenForm = z.infer<typeof ResetTokenSchema>;