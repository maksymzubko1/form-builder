export enum ERegisterStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

export type TRegisterPageParams = {
  params: Promise<{ token: string | undefined }>, searchParams: Promise<{ status: ERegisterStatus | undefined }>
}