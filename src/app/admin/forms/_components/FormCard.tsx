'use client';

import { FormListItem } from '@/app/admin/forms/types';
import Link from 'next/link';
import { PublishFormButton } from '@/app/admin/forms/[id]/_components/PublishFormButton';
import { CopyFormButton } from '@/app/admin/forms/[id]/_components/CopyFormButton';
import { DeleteFormDialog } from '@/app/admin/forms/[id]/_components/DeleteFormDialog';
import {
  Card,
  CardAction,
  CardFooter,
  CardContent,
  CardTitle,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  form: FormListItem;
  refetch: () => void;
}

export function FormCard({ form, refetch }: Props) {
  const onDeleteDone = () => {
    refetch();
  };

  const onPublishDone = () => {
    refetch();
  };

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle className="row-span-2 items-center">
          {form.title}
        </CardTitle>
        <CardAction className="items-center">
            <span className={`text-xs ${form.isPublished ? 'bg-green-100 text-green-700' : 'bg-muted text-gray-300'} px-2 py-0.5 rounded`}>
            {form.isPublished ? 'Published' : 'Draft'}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent>
        {form.description ? form.description : 'No description'}
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex gap-8 mt-2 justify-between w-full">
          <div className="flex gap-2 flex-col">
            <div className="flex gap-2 items-center">
              <Button aria-label="Edit form" asChild>
                <Link href={`/admin/forms/${form.id}`}>
                  Edit
                </Link>
              </Button>
              <Button aria-label="View public form" asChild>
                <Link href={`/form/${form.id}`} target="_blank">
                  View
                </Link>
              </Button>
            </div>
            <div className="flex gap-2 items-center justify-between">
              <PublishFormButton formId={form.id} isPublished={form.isPublished} onDone={onPublishDone} size="icon" />
              <CopyFormButton formId={form.id} size="icon" />
              <DeleteFormDialog formId={form.id} size="icon" onDone={onDeleteDone} />
            </div>
          </div>
          <div className="text-xs text-gray-400 self-end">
            <b>Updated:</b> {new Date(form.updatedAt).toLocaleString()}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
