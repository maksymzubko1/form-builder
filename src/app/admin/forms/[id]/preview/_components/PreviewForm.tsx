'use client';

import { Button } from '@/components/ui/button';
import PuckRender from '@/components/shared/PuckEditor/PuckRender';
import { Input } from '@/components/ui/input';
import { FormType } from '@/types/forms';
import { Label } from '@/components/ui/label';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';

type Props = {
  form: FormType & { id: string; isPublished: boolean };
}

export function PreviewForm({ form }: Props) {
  const { setPageTitle } = useSidebar();

  useEffect(() => {
    setPageTitle('Preview form (DEMO)');
  }, [setPageTitle]);

  return (
    <form noValidate
          className="dark max-w-[1280px] w-full md:mx-auto md:my-12 p-6 bg-muted md:rounded shadow space-y-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 ">{form.title}</h1>
      {form.description && <p className="text-muted-foreground mb-4">{form.description}</p>}
      <div className="pr-3 pl-3 pb-8 border-b-[1px]">
        <Label className="mb-3">Email</Label>
        <Input readOnly tabIndex={0} className="text-muted bg-muted" placeholder="user@gmail.com"
               autoFocus />
      </div>
      <PuckRender content={form.content} />
      <div className="flex gap-2 mt-4 justify-center">
        <Button
          type="button"
          variant="secondary"
          className="bg-neutral-700 hover:bg-neutral-700 hover:opacity-90"
          disabled
        >
          Save and continue later
        </Button>
        <Button type="submit" disabled>
          Submit
        </Button>
      </div>
    </form>
  );
}
