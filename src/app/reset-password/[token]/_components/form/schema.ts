import { z } from 'zod';

export const ResetTokenSchema = z.object({
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});
export type ResetTokenForm = z.infer<typeof ResetTokenSchema>;