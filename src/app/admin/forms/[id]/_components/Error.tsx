import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FieldErrors } from 'react-hook-form';
import { Data } from '@measured/puck';

interface Props {
  errors: FieldErrors<{
    title: string;
    emailNotification: boolean;
    content: Data;
    description?: string | undefined;
  }>;
}

const Error = ({ errors }: Props) => {
  if ((errors && errors.title) || errors.content || errors.description) {
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Unable to save your form.</AlertTitle>
        <AlertDescription>
          <p>Please check your form information and try again.</p>
          <ul className="list-inside list-disc text-sm">
            {errors.title && <li className="text-sm">{errors.title.message}</li>}
            {errors.description && <li className="text-sm">{errors.description.message}</li>}
            {errors.content && <li className="text-sm">{errors.content.message}</li>}
          </ul>
        </AlertDescription>
      </Alert>
    );
  }

  return <span className="sr-only" />;
};

export default Error;
