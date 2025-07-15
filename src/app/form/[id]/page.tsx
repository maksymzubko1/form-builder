import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { PublicForm } from './_components/PublicForm';
import { API_ROUTES } from '@/contants/routes';
import { FormSubmitSuccess } from '@/app/form/[id]/_components/Success';
import { FormProps } from '@/app/form/[id]/types';
import { EmailStep } from '@/app/form/[id]/_components/EmailStep';

export const metadata: Metadata = {
  title: 'Fill out the form',
  description: 'Public form page',
  robots: 'noindex',
};

async function getForm(id: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}${API_ROUTES.PUBLIC_FORMS}/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.form;
}

export default async function PublicFormPage({ params, searchParams }: FormProps) {
  const { status, email} = await searchParams;
  const form = await getForm((await params).id);
  if (!form) return notFound();

  if (status) {
    return <FormSubmitSuccess type={status} />;
  }

  if(!email || !email.length) {
    return <EmailStep />
  }

  return <PublicForm form={form} email={email} />;
}
