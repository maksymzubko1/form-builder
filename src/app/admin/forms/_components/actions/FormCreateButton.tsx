'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export function FormCreateButton() {
  return (
    <Button type="button" aria-label="Create new form" asChild>
      <Link href={ROUTES.ADMIN_FORMS_CREATE}>+ Create Form</Link>
    </Button>
  );
}
