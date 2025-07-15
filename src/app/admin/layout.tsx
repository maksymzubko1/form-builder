import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';
import { SidebarLayout } from '@/app/_components/SidebarLayout';

export const metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s | Admin Panel'
  },
  description: 'Manage your forms, submissions, and AI assistant in the admin dashboard.',
  robots: 'noindex'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${ROUTES.LOGIN}`);
  }

  return (
    <SidebarLayout session={session}>
      {children}
    </SidebarLayout>
  );
}
