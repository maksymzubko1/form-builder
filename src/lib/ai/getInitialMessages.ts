import { API_ROUTES } from '@/constants/routes';
import { TResponse } from '@/types/general';
import { Message } from '@/types/puck';

export async function requestInitialMessages(
  formId: string,
): Promise<TResponse<{ messages: Message[] }>> {
  const res = await fetch(`${API_ROUTES.AI}?formId=${formId}`);
  if (res.ok) {
    const data = await res.json();
    return { status: 'success', data: { messages: data.messages } };
  } else {
    const json = await res.json();
    return { status: 'error', error: json?.error?.message };
  }
}
