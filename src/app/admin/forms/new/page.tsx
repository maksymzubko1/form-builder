import { Metadata } from 'next';
import { FormEditor } from './_components/FormEditor';

export const metadata: Metadata = {
  title: 'Create Form',
  description: 'Create a new smart form using Puck visual editor.',
  robots: 'noindex',
};

export default function CreateFormPage() {
  return <FormEditor />;
}
