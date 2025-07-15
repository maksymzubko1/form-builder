import ResetForm from './_components/form/Form';
import { ResetSuccess } from './_components/Success';
import { EResetPasswordStatus, TResetPasswordProps } from './types';

export const metadata = {
  title: 'Reset Password',
  description: 'Forgot your password? Enter your email to reset it.',
  robots: 'noindex'
};

export default async function ResetPage({ searchParams }: TResetPasswordProps) {
  const { status } = await searchParams;

  if (status === EResetPasswordStatus.SUCCESS) {
    return <ResetSuccess />;
  }

  return (
    <ResetForm />
  );
}
