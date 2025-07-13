export enum EResetPasswordStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export type TResetPasswordProps = {
  searchParams: Promise<{ status: EResetPasswordStatus | undefined }>;
};