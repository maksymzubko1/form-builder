import RegisterForm from './_components/form/Form';
import { RegisterSuccess } from './_components/Success';
import { ERegisterStatus, TRegisterPageParams } from './types';

export const metadata = {
  title: 'Register',
  description: 'Create a free account and start building smart forms with AI assistant.',
  robots: 'noindex',
};

export default async function RegisterPage({ searchParams }: TRegisterPageParams) {
  const { status } = await searchParams;

  if (status === ERegisterStatus.SUCCESS) {
    return <RegisterSuccess />;
  }

  return (
    <RegisterForm />
  );
}
