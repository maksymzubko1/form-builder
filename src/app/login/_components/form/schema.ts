import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.email('Incorrect email'),
  password: z.string().min(1, 'Enter password'),
});
export type LoginForm = z.infer<typeof LoginSchema>;