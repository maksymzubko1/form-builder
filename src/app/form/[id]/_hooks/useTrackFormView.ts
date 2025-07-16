import { useEffect } from 'react';
import { API_ROUTES } from '@/constants/routes';

export function useTrackFormView(formId: string, email: string) {
  useEffect(() => {
    fetch(API_ROUTES.FORM_VIEW(formId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  }, [formId, email]);
}
