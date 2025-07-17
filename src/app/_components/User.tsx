'use client';


import {
  SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import LogoutButton from '@/components/shared/LogoutButton';

export function User({ session }: {
  session?: {
    user: {
      email: string
    }
  }
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{session?.user.email?.split("@")[0]}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="[&>button]:w-full">
            <SidebarMenuButton asChild>
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}