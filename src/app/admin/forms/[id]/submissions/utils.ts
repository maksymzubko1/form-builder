import { API_ROUTES } from '@/constants/routes';
import { prepareSubmissions } from '@/lib/submissions/utils';
import {
  TRequestSubmissions,
  TResponseParsedSubmissions,
  TResponseSubmissions,
} from '@/app/admin/forms/[id]/submissions/types';
import { TResponse } from '@/types/general';
import { SubmissionData } from '@/types/submissions';

export async function requestSubmissionsByParams(
  id: string,
  params: TRequestSubmissions,
): Promise<TResponse<TResponseParsedSubmissions>> {
  const urlParams = new URLSearchParams({
    ...params,
  } as Record<string, string>);

  const res = await fetch(`${API_ROUTES.FORM_SUBMISSIONS(id)}?${urlParams}`);
  if (res.ok) {
    const json = (await res.json()) as TResponseSubmissions;
    const parsedData = json.data.map((item) => ({
      ...item,
      data: prepareSubmissions(item.data as SubmissionData),
    }));
    return { status: 'success', data: { data: parsedData, total: json.total } };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error || 'Failed to get submissions' };
  }
}

export async function requestSubmissionsDelete(
  formId: string,
  submissionId?: string,
): Promise<TResponse<boolean>> {
  const res = await fetch(
    submissionId
      ? API_ROUTES.FORM_SUBMISSION(formId, submissionId)
      : API_ROUTES.FORM_SUBMISSIONS(formId),
    { method: 'DELETE' },
  );

  if (res.ok) {
    return { status: 'success', data: true };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error || 'Failed to delete submissions' };
  }
}
