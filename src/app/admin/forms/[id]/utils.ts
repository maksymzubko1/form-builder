import { API_ROUTES } from '@/constants/routes';
import { TResponse } from '@/types/general';
import { TResponseUpdateForm } from '@/app/admin/forms/[id]/types';
import { FormType } from '@/types/forms/forms';

export async function requestUpdateForm(
  id: string,
  data: FormType,
): Promise<TResponse<TResponseUpdateForm>> {
  const res = await fetch(`${API_ROUTES.FORMS}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ ...data }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    const json = await res.json();
    return { status: 'success', data: json };
  } else {
    const json = await res.json();
    return { status: 'error', error: json.error || 'Failed to update form' };
  }
}
