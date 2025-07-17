'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ROUTES } from '@/constants/routes';
import { LibraryIcon, UserIcon } from 'lucide-react';
import { AdminNav } from '@/app/_components/AdminNav';
import { User } from '@/app/_components/User';

const data = {
  navMain: [
    {
      title: 'My Forms',
      url: ROUTES.ADMIN_FORMS,
      icon: LibraryIcon,
    },
    {
      title: 'My Profile',
      url: ROUTES.ADMIN_PROFILE,
      icon: UserIcon,
    },
  ],
};

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar> & {
  session?: { user: { email: string } }
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <span className="text-base font-semibold">Form Builder AI</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNav items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <User session={props.session} />
      </SidebarFooter>
    </Sidebar>
  );
}
