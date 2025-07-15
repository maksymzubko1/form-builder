import { z } from 'zod';
import { Data } from '@measured/puck';
import { InteractiveItems } from '@/components/shared/PuckEditor/config';

export const FormSchema = z.object({
  title: z.string().min(2, 'Title is required').max(128),
  description: z.string().max(1024).optional(),
  content: z
    .custom<Data>()
    .refine(
      (val): val is Data => !(!val || Array.isArray(val.content) && val.content.length === 0),
      { message: 'Form must have at least one component' },
    ).refine(
      (val): val is Data => val.content.filter(content => InteractiveItems.includes(content.type)).length !== 0,
      { message: 'Form must have at least interactive component' },
    ),
});
export type FormType = z.infer<typeof FormSchema>;

export const EmailSchema = z.object({
  email: z.email('Invalid email address'),
});
export type EmailType = z.infer<typeof EmailSchema>;
