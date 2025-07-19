import { API_ROUTES } from '@/constants/routes';
import { ERegisterResponse, RegisterForm } from '@/types/register';
import { TResponse } from '@/types/general';

export async function requestRegister(data: RegisterForm): Promise<TResponse<boolean>> {
  const res = await fetch(API_ROUTES.REGISTER, {
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
      error: ERegisterResponse[json.error as keyof typeof ERegisterResponse] || json.error,
    };
  }
}
