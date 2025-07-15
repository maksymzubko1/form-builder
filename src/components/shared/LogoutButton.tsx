'use client'

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { ROUTES } from '@/constants/routes';

export default function LogoutButton(){
  const logout = () => signOut({callbackUrl: ROUTES.LOGIN})

  return (
    <Button onClick={logout}>Log out</Button>
  )
}