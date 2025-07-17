import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FormEditor } from './_components/FormEditor';
import { cookies } from 'next/headers';
import { API_ROUTES } from '@/constants/routes';

export const metadata: Metadata = {
  title: 'Edit Form',
  description: 'Edit your form with Puck visual editor.',
  robots: 'noindex',
};

type Props = { params: Promise<{ id: string }> };

async function getFormData(formId: string) {
  const cookie = (await cookies()).toString();
  const res = await fetch(`${process.env.NEXTAUTH_URL}${API_ROUTES.FORMS}/${formId}`, { headers: { cookie } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.form;
}

export default async function EditFormPage({ params }: Props) {
  const initialForm = await getFormData((await params).id);
  if (!initialForm) return notFound();

  return (<FormEditor initialForm={initialForm} />);
}
