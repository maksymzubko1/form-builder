'use client';

import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

import AdminNav from '@/app/_components/AdminNav';
import LogoutButton from '@/components/shared/LogoutButton';
import { Session } from 'next-auth';

type Props = {
  children: React.ReactNode;
  session?: Session;
}

export function SidebarLayout({ session, children }: Props) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  return (
    <div className="flex min-h-screen">
      <aside
        className={clsx(`bg-background z-30 w-64 border-r shadow min-h-screen`, open ? 'translate-x-0' : '-translate-x-full md:translate-x-0', 'fixed top-0 left-0 md:relative md:translate-x-0 transition-transform duration-300')}
        aria-label="Sidebar">
        <div className="flex justify-between items-center gap-10  border-b">
          <div className="p-4 text-lg font-bold">Form Builder AI</div>
        </div>
        <AdminNav onClose={onClose} />
        <div className="mt-auto p-4 border-t text-xs text-gray-500">
          {session?.user?.email}
        </div>
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex-1 ml-0">
        <div className="md:hidden p-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="Open sidebar"
          >
            <MenuIcon />
          </Button>
        </div>
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
