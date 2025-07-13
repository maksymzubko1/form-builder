import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email('Incorrect email'),
  password: z.string().min(6, 'Password at least 6 characters'),
});
export type RegisterForm = z.infer<typeof RegisterSchema>;