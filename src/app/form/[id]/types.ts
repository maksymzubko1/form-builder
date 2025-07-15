import { z } from 'zod';

export const emailSchema = z.email('Valid email is required');

export type FormProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: 'draft' | 'sent'; email?: string; }>
}

export enum EFromStatus {
  SENT = 'sent',
  DRAFT = 'draft',
}