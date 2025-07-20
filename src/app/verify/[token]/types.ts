import { EVerifyResponseStatus } from '@/types/auth/verify';

export type TVerifyTokenProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status: EVerifyResponseStatus | undefined }>;
};
