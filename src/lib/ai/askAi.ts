import { API_ROUTES } from '@/constants/routes';
import { ComponentData } from '@measured/puck';

export async function askAi(
  prompt: string,
  context: {
    context: ComponentData[];
    selectedFields: ComponentData[];
  },
  formId: string,
) {
  const res = await fetch(`${API_ROUTES.AI}`, {
    method: 'POST',
    body: JSON.stringify({ prompt, context, formId }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
