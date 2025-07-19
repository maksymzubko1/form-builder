'use client';

import { Button } from '@/components/ui/button';

type Props = {
  type: 'draft' | 'sent';
};

export function FormSubmitSuccess({ type }: Props) {
  if (type === 'sent') {
    return (
      <div className="max-w-sm mx-auto pt-16">
        <h2 className="text-xl font-bold mb-2">Thanks you!</h2>
        <p>You successfully sent this form. You can close this page.</p>
      </div>
    );
  }

  const onBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  if (type === 'draft') {
    return (
      <div className="max-w-sm mx-auto pt-16">
        <h2 className="text-xl font-bold mb-2">Your data successfully saved</h2>
        <p>
          A draft was saved. Next time, you can easily continue to fill the form, using your email.
        </p>
        <Button tabIndex={0} className="mt-4" onClick={onBack}>
          Back to form
        </Button>
      </div>
    );
  }

  return <span className="sr-only" />;
}
