export enum ERegisterResponse {
  FieldsRequired = 'Email and password required',
  UserExist = "User is already exist"
}

export enum ERegisterStatus {
  SUCCESS = 'success',
  ERROR = 'error'
}

export type TRegisterPageParams = {
  params: Promise<{ token: string | undefined }>, searchParams: Promise<{ status: RegisterStatus | undefined }>
}