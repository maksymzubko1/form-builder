import { TResponse } from '@/types/general';
import { API_ROUTES } from '@/constants/routes';
import { FormType } from '@/types/forms/forms';
import { FormListItem } from '@/app/admin/forms/types';

export async function requestCreateForm(
  data: FormType,
): Promise<TResponse<{ form: FormListItem }>> {
  const res = await fetch(API_ROUTES.FORMS, {
    method: 'POST',
    body: JSON.stringify({ ...data }),
    headers: { 'Content-Type': 'application/json' },
  });
  if (res.ok) {
    const json = (await res.json()) as { form: FormListItem };
    return { status: 'success', data: json };
  } else {
    const json = await res.json();
    return { error: json.error || 'Failed to create form', status: 'error' };
  }
}
