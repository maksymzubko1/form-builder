import { API_ROUTES } from '@/constants/routes';
import { ChangePasswordForm as TChangePasswordForm } from '@/types/change-password';
import { TResponse } from '@/types/general';

export async function requestPasswordChange(
  data: TChangePasswordForm,
): Promise<TResponse<boolean>> {
  const res = await fetch(API_ROUTES.CHANGE_PASSWORD, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error || 'Failed to change password' };
  }
}
