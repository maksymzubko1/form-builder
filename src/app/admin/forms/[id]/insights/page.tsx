import { InsightsLayout } from './_components/InsightsLayout';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Form Insights',
  description: 'Analytics, conversion and stats for your form submissions.',
  robots: 'noindex',
};

type InsightsPageProps =
  { params: Promise<{ id: string }> }


export default async function InsightsPage({ params }: InsightsPageProps) {
  const { id } = await params;
  return (
    <div>
      <Button variant="secondary" asChild className="mb-4">
        <Link href={`${ROUTES.ADMIN_FORMS}/${id}`} className="flex items-center">
          <ArrowLeft /> Back to form
        </Link>
      </Button>
      <InsightsLayout formId={id} />
    </div>
  );
}
