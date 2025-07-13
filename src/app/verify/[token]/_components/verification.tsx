'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_ROUTES, ROUTES } from '@/contants/routes';
import { EVerifyResponseStatus } from '@/types/verify';

export default function VerifyToken({ token }: { token: string }) {
  const { push } = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_ROUTES.VERIFY}/${token}`);
        if (res.ok) {
          push(`${ROUTES.VERIFY}?status=${EVerifyResponseStatus.SUCCESS}`);
        } else {
          const json = await res.json();
          push(`${ROUTES.VERIFY}?status=${EVerifyResponseStatus[json.status.toUpperCase() as keyof typeof EVerifyResponseStatus] || EVerifyResponseStatus.ERROR}`);
        }
      } catch {
        push(`${ROUTES.VERIFY}/?status=${EVerifyResponseStatus.ERROR}`);
      }
    };

    verifyToken();
  }, [push, token]);

  return <span className="sr-only">Confirming email...</span>;
}
