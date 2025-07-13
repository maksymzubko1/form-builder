import ResetTokenForm from './_components/form/form';
import { validateToken } from '@/lib/auth';
import Link from 'next/link';
import { ROUTES } from '@/contants/routes';
import { Button } from '@/components/ui/button';
import { TResetTokenPageParams } from './types';

export const metadata = {
  title: 'Set New Password',
  description: 'Set a new password for your account.',
  robots: 'noindex'
};

export default async function ResetTokenPage({ params }: TResetTokenPageParams) {
  const { token } = await params;
  const isValidToken = token ? await validateToken(token, 'reset') : false;

  if (!isValidToken) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h2 className="text-xl font-bold mb-2">Token is not valid!</h2>
        <Button tabIndex={0} className="mt-4" asChild>
          <Link href={ROUTES.LOGIN}>Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <ResetTokenForm />
  );
}
