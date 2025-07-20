'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { EVerifyResponseStatus } from '@/types/auth/verify';
import { requestVerify } from '@/app/verify/[token]/utils';

export default function VerifyToken({ token }: { token: string }) {
  const { push } = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await requestVerify(token);

        if (res.status === 'success') {
          push(`${ROUTES.VERIFY}?status=${EVerifyResponseStatus.SUCCESS}`);
        } else {
          push(`${ROUTES.VERIFY}?status=${res.error}`);
        }
      } catch (e: unknown) {
        console.log(e);
        push(`${ROUTES.VERIFY}/?status=${EVerifyResponseStatus.ERROR}`);
      }
    };

    verifyToken();
  }, [push, token]);

  return <span className="sr-only">Confirming email...</span>;
}
