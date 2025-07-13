import { z } from 'zod';

export enum ERegisterResponseCode {
  FIELDS_REQUIRED = "FieldsRequired",
  USER_EXIST = "UserExist",
}

export enum ERegisterResponse {
  FieldsRequired = 'Email and password required',
  UserExist = "User is already exist"
}

export const RegisterSchema = z.object({
  email: z.email('Incorrect email'),
  password: z.string().min(6, 'Password at least 6 characters'),
});
export type RegisterForm = z.infer<typeof RegisterSchema>;