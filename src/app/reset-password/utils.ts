import { API_ROUTES } from '@/constants/routes';
import { ResetForm } from '@/types/reset-password';
import { TResponse } from '@/types/general';

export async function requestPasswordReset(data: ResetForm): Promise<TResponse<boolean>> {
  const res = await fetch(API_ROUTES.RESET, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return { status: 'error', error: json.error || 'Unknown error' };
  }
}
