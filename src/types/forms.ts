import { z } from 'zod';

export const FormSchema = z.object({
  title: z.string().min(2, 'Title is required').max(128),
  description: z.string().max(1024).optional(),
  content: z.any(), // под редактор (например, Puck)
});
export type FormType = z.infer<typeof FormSchema>;