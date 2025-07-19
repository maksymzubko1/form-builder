import { API_ROUTES } from '@/constants/routes';
import { Data } from '@measured/puck';

export async function fetchSubmissionsStats(formId: string, from?: string, to?: string) {
  const params = new URLSearchParams();
  if (from) params.append('from', from);
  if (to) params.append('to', to);

  const res = await fetch(`${API_ROUTES.FORM_INSIGHTS(formId)}?${params.toString()}`);
  return res.json();
}

export async function fetchFormContent(formId: string) {
  const res = await fetch(`${API_ROUTES.FORMS}/${formId}`);
  const json = await res.json();
  return json.form?.content as Data;
}
