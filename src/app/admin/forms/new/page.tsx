import { Metadata } from 'next';
import { FormEditor } from './_components/FormEditor';

export const metadata: Metadata = {
  title: 'Create Form',
  description: 'Create a new smart form using Puck visual editor.',
  robots: 'noindex'
};

export default function CreateFormPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Create Form</h1>
      <FormEditor mode="create" />
    </section>
  );
}
