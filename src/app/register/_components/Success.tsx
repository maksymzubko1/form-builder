'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';

export function RegisterSuccess() {
  const { push } = useRouter();
  return (
    <div className="max-w-sm mx-auto mt-16">
      <h2 className="text-xl font-bold mb-2">Check your email</h2>
      <p>A confirmation link has been sent to your email.</p>
      <Button tabIndex={0} className="mt-4" onClick={() => push(ROUTES.LOGIN)}>Go to login</Button>
    </div>
  );
}