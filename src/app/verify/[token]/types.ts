import { EVerifyResponseStatus } from '@/types/verify';

export type TVerifyTokenProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ status: EVerifyResponseStatus | undefined }>;
};
