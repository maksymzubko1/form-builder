import { SubmissionsTable } from './_components/SubmissionsTable';
import type { FC } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Form submissions',
  description: 'Analyze your form submissions.',
  robots: 'noindex'
};

interface SubmissionsPageProps {
  params: { id: string };
}

const SubmissionsPage: FC<SubmissionsPageProps> = ({ params }) => {
  return <SubmissionsTable formId={params.id} />;
};

export default SubmissionsPage;
