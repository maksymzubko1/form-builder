import { Metadata } from 'next';
import { FormsTable } from './_components/FormList';

export const metadata: Metadata = {
  title: 'My Forms',
  description: 'List of all your forms. Create, edit, publish, or delete forms.',
  robots: 'noindex'
};

export default function AdminFormsPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">My Forms</h1>
      <FormsTable />
    </section>
  );
}
