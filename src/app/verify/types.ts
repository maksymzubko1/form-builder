import { EVerifyResponseStatus } from '@/types/verify';

export type TVerifyProps = {
  searchParams: Promise<{ status: EVerifyResponseStatus | undefined }>;
};