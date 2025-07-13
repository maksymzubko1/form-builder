export type TResetTokenPageParams = {
  params: Promise<{ token: string | undefined }>, searchParams: Promise<{ status: ResetTokenStatus | undefined }>
}

export enum ETokenReset {
  InvalidToken = 'Token is invalid',
}

export enum ResetTokenStatus {
  DONE = 'done',
  ERROR = 'error'
}