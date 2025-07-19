import { ETokenReset, ResetTokenForm } from '@/types/reset-password';
import { TResponse } from '@/types/general';
import { API_ROUTES } from '@/constants/routes';

export async function requestPasswordResetByToken(
  token: string,
  data: ResetTokenForm,
): Promise<TResponse<boolean>> {
  const res = await fetch(API_ROUTES.RESET_TOKEN(token), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return {
      status: 'error',
      error: ETokenReset[json.error as keyof typeof ETokenReset] || json.error,
    };
  }
}
