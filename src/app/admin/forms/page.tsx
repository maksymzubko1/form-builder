import { Metadata } from 'next';
import { FormsTable } from './_components/FormList';

export const metadata: Metadata = {
  title: 'My Forms',
  description: 'List of all your forms. Create, edit, publish, or delete forms.',
  robots: 'noindex',
};

export default function AdminFormsPage() {
  return <FormsTable />;
}
