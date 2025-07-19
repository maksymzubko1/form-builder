import { API_ROUTES } from '@/constants/routes';
import { TResponse } from '@/types/general';
import { FormListItem, TRequestFormParams, TResponseForms } from '@/app/admin/forms/types';

export async function requestFormsByParams({
  status,
  search,
  order,
  limit,
  page,
}: TRequestFormParams): Promise<TResponse<TResponseForms>> {
  const params = new URLSearchParams({
    ...(search && { search }),
    ...(status !== 'all' && { status }),
    ...(order && { order }),
    page: String(page),
    limit: String(limit),
  });
  const res = await fetch(`${API_ROUTES.FORMS}?${params.toString()}`);
  if (res.ok) {
    const data = await res.json();
    return { status: 'success', data: data };
  } else {
    const json = await res.json();
    return { status: 'error', error: json.error || 'Something went wrong.' };
  }
}

export async function requestCopyForm(formId: string): Promise<TResponse<FormListItem>> {
  const res = await fetch(`${API_ROUTES.FORMS}/${formId}/copy`, { method: 'POST' });
  if (res.ok) {
    const { form } = await res.json();
    return { status: 'success', data: form };
  } else {
    const json = await res.json();
    return { status: 'error', error: json.error || 'Failed to copy form' };
  }
}

export async function requestDeleteForm(formId: string): Promise<TResponse<boolean>> {
  const res = await fetch(`${API_ROUTES.FORMS}/${formId}`, { method: 'DELETE' });

  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error || 'Failed to delete form' };
  }
}

export async function requestPublishForm(
  formId: string,
  isPublished: boolean,
): Promise<TResponse<boolean>> {
  const res = await fetch(`${API_ROUTES.FORMS}/${formId}/publish`, {
    method: 'POST',
    body: JSON.stringify({ isPublished: !isPublished }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error || 'Failed to publish form' };
  }
}
