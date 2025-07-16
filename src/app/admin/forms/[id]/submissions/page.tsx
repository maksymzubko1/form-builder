import { SubmissionsTable } from './_components/SubmissionsTable';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Form submissions',
  description: 'Analyze your form submissions.',
  robots: 'noindex',
};

interface SubmissionsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { id } = await params;

  return (
    <div>
      <Button variant="secondary" asChild className="mb-4">
        <Link href={`${ROUTES.ADMIN_FORMS}/${id}`} className="flex items-center">
          <ArrowLeft /> Back to form
        </Link>
      </Button>
      <SubmissionsTable formId={id} />
    </div>
  );
};
