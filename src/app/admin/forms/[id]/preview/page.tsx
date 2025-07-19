import { Metadata } from 'next';
import { API_ROUTES, ROUTES } from '@/constants/routes';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { PreviewForm } from '@/app/admin/forms/[id]/preview/_components/PreviewForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Preview Form',
  description: 'Preview your form with Puck visual editor.',
  robots: 'noindex',
};

async function getFormData(formId: string) {
  const cookie = (await cookies()).toString();
  const res = await fetch(`${process.env.NEXTAUTH_URL}${API_ROUTES.FORMS}/${formId}`, {
    headers: { cookie },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.form;
}

interface PreviewFormProps {
  params: Promise<{ id: string }>;
}

export default async function PreviewFormPage({ params }: PreviewFormProps) {
  const { id } = await params;
  const initialForm = await getFormData(id);
  if (!initialForm) return notFound();

  return (
    <section>
      <Button variant="secondary" asChild className="mb-4">
        <Link href={`${ROUTES.ADMIN_FORMS}/${id}`} className="flex items-center">
          <ArrowLeft /> Back to form
        </Link>
      </Button>
      <PreviewForm form={initialForm} />
    </section>
  );
}
