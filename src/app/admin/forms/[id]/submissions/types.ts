import { z } from 'zod';
import { Submission } from '@/types/submissions';

export const SubmissionsFilterSchema = z.object({
  email: z.email().optional(),
  from: z.string().optional(), // ISO Date
  to: z.string().optional(), // ISO Date
  query: z.string().optional(),
  order: z.string().optional(),
});

export type SubmissionsFilter = z.infer<typeof SubmissionsFilterSchema>;

export type TRequestSubmissions = {
  email?: string;
  from?: string;
  to?: string;
  query?: string;
  order?: string;
  page: string;
  perPage: string;
};

export type TResponseSubmissions = {
  data: Submission[];
  total: number;
};

export type TResponseParsedSubmissions = {
  data: {
    data: Record<string, string | null>;
    id: string;
    email: string;
    submittedAt: string;
  }[];
  total: number;
};
