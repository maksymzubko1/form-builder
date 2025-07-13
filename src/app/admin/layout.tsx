import { ReactNode } from 'react';
import AdminNav from '@/app/_components/AdminNav';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/route';
import { ROUTES } from '@/contants/routes';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/shared/LogoutButton';

export const metadata = {
  title: 'Admin Panel',
  description: 'Manage your forms, submissions, and AI assistant in the admin dashboard.',
  robots: 'noindex'
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${ROUTES.LOGIN}`);
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r shadow">
        <div className="p-4 text-lg font-bold border-b">Form Builder AI</div>
        <AdminNav />
        <div className="mt-auto p-4 border-t text-xs text-gray-500">
          {session?.user?.email}
        </div>
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
