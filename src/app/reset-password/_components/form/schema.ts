import { z } from 'zod';

export const ResetSchema = z.object({
  email: z.email('Некорректный email'),
});
export type ResetForm = z.infer<typeof ResetSchema>;