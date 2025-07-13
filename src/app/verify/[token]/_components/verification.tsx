'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES, ROUTES } from '@/contants/routes';
import { EVerifyTokenStatus } from '@/app/verify/[token]/types';

export default function VerifyToken({ token }: { token: string }) {
  const { push } = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_ROUTES.VERIFY}/${token}`);
        if (res.ok) {
          push(`${ROUTES.VERIFY}?status=${EVerifyTokenStatus.SUCCESS}`);
        } else {
          const json = await res.json();
          push(`${ROUTES.VERIFY}?status=${EVerifyTokenStatus[json.status.toUpperCase() as keyof typeof EVerifyTokenStatus] || EVerifyTokenStatus.ERROR}`);
        }
      } catch {
        push(`${ROUTES.VERIFY}/?status=${EVerifyTokenStatus.ERROR}`);
      }
    };

    verifyToken();
  }, [push, token]);

  return <span className="sr-only">Confirming email...</span>;
}
