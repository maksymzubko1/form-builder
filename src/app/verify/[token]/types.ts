export enum EVerifyTokenStatus {
  PENDING = 'pending',
  ERROR = 'error',
  SUCCESS = 'success',
  ALREADY_VERIFIED = 'already_verified',
}

export type TVerifyTokenProps = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ status: EVerifyTokenStatus | undefined }>;
};