import { TResponse } from '@/types/general';
import { API_ROUTES } from '@/constants/routes';
import { EVerifyResponseStatus } from '@/types/auth/verify';

export async function requestVerify(token: string): Promise<TResponse<boolean>> {
  const res = await fetch(`${API_ROUTES.VERIFY}/${token}`);
  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return {
      status: 'error',
      error:
        EVerifyResponseStatus[json.status.toUpperCase() as keyof typeof EVerifyResponseStatus] ||
        EVerifyResponseStatus.ERROR,
    };
  }
}
