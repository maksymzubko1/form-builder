import { EVerifyResponseStatus } from '@/types/auth/verify';

export type TVerifyProps = {
  searchParams: Promise<{ status: EVerifyResponseStatus | undefined }>;
};
