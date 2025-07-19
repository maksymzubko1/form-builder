import { TVerifyTokenProps } from './types';
import VerifyToken from './_components/Verification';

export const metadata = {
  title: 'Confirming Email',
  description: 'Confirming your email address...',
  robots: 'noindex',
};

export default async function VerifyTokenPage({ params }: TVerifyTokenProps) {
  const { token } = await params;

  return (
    <div className="max-w-sm mx-auto mt-16">
      <VerifyToken token={token} />
      <p>We are confirming your email, please wait...</p>
    </div>
  );
}
