export enum EVerifyStatus {
  PENDING = 'pending',
  ERROR = 'error',
  SUCCESS = 'success',
  ALREADY_VERIFIED = 'already_verified',
}

export type TVerifyProps = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ status: EVerifyStatus | undefined }>;
};