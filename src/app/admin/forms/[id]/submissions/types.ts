import { z } from 'zod';

export const SubmissionsFilterSchema = z.object({
  email: z.email().optional(),
  from: z.string().optional(), // ISO Date
  to: z.string().optional(), // ISO Date
  query: z.string().optional(),
  order: z.string().optional(),
});

export type SubmissionsFilter = z.infer<typeof SubmissionsFilterSchema>;
