import { z } from 'zod';

export const AIRequest = z.object({
  prompt: z.string().min(2, 'Prompt must be at least 2 characters'),
  context: z.object({
    context: z.any().array(),
    selectedFields: z.any().array(),
  }),
  formId: z.string().min(2).optional(),
});
export type AIRequestForm = z.infer<typeof AIRequest>;

export const AIMessages = z.object({
  formId: z.string().min(2),
});
export type AIMessagesForm = z.infer<typeof AIMessages>;
