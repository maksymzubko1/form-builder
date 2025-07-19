import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/api/auth/[...nextauth]/options';
import { ROUTES } from '@/constants/routes';
import { redirect } from 'next/navigation';

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/app/_components/AdminSidebar';
import { SiteHeader } from '@/app/_components/SiteHeader';

export const metadata = {
  title: {
    default: 'Admin Panel',
    template: '%s | Admin Panel',
  },
  description: 'Manage your forms, submissions, and AI assistant in the admin dashboard.',
  robots: 'noindex',
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`${ROUTES.LOGIN}`);
  }

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 52)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AdminSidebar variant="inset" session={session} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6 md:mx-6">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
