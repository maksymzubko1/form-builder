import { redirect } from 'next/navigation';
import { ROUTES } from '@/contants/routes';
import { Button } from '@/components/ui/button';
import { EVerifyResponseStatus } from '@/types/verify';
import { TVerifyProps } from './types';
import Link from 'next/link';

export const metadata = {
  title: 'Email Verification',
  description: 'Verify your email address to activate your account.',
  robots: 'noindex',
};

export default async function VerifyTokenPage({ searchParams }: TVerifyProps) {
  const { status } = await searchParams;

  if (!status) {
    redirect(`${ROUTES.LOGIN}`);
  }

  if (status === EVerifyResponseStatus.SUCCESS) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h2 className="text-xl font-bold mb-2">Email successfully verified!</h2>
        <p>You can close this page or click the button below.</p>
        <Button tabIndex={0} className="mt-4" asChild>
          <Link href={ROUTES.LOGIN}>
            Go to login
          </Link>
        </Button>
      </div>
    );
  }

  if (status === EVerifyResponseStatus.ALREADY_VERIFIED) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h2 className="text-xl font-bold mb-2">Email already verified!</h2>
        <p>You can sign in now.</p>
        <Button tabIndex={0} className="mt-4" asChild>
          <Link href={ROUTES.LOGIN}>Go to login</Link>
        </Button>
      </div>
    );
  }

  if (status === EVerifyResponseStatus.ERROR) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <h2 className="text-xl font-bold mb-2">Email verification failed!</h2>
        <p>Please try again or contact support.</p>
        <Button tabIndex={0} className="mt-4" asChild>
          <Link href={ROUTES.LOGIN}>
            Go to login
          </Link>
        </Button>
      </div>
    );
  }

  redirect(`${ROUTES.LOGIN}`);
}
