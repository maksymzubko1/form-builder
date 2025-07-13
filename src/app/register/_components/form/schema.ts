import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.email('Некорректный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
});
export type RegisterForm = z.infer<typeof RegisterSchema>;