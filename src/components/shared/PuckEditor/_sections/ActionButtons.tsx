'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { PublishFormButton } from '@/app/admin/forms/_components/actions/PublishFormButton';
import { CopyFormButton } from '@/app/admin/forms/_components/actions/CopyFormButton';
import { DeleteFormAction } from '@/app/admin/forms/_components/actions/DeleteFormAction';
import { useRouter } from 'next/navigation';
import { useModal } from '@/lib/hooks/useModal';
import { DeleteFormDialog } from '@/app/admin/forms/_components/actions/DeleteFormDialog';
import { MoreHorizontal } from 'lucide-react';

interface Props {
  formProps: {
    id: string;
    isPublished: boolean;
  };
}

const ActionButtons = ({ formProps }: Props) => {
  const router = useRouter();
  const { toggle, open, hide } = useModal();

  const onPublish = () => {
    router.refresh();
  };
  const onDelete = () => {
    toggle();
  };
  const onDeleteCompleted = () => {
    router.push(`${ROUTES.ADMIN_FORMS}`);
  };
  const onCopy = () => {};

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              className="w-full flex cursor-pointer"
              href={ROUTES.FORM(formProps.id)}
              target="_blank"
            >
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <PublishFormButton
              formId={formProps.id}
              isPublished={formProps.isPublished}
              size="default"
              onDone={() => onPublish()}
              asDropdown
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyFormButton
              formId={formProps.id}
              size="default"
              onCopy={() => onCopy()}
              asDropdown
            />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteFormAction onClick={() => onDelete()} size="default" asDropdown />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              className="w-full flex cursor-pointer"
              href={ROUTES.ADMIN_FORM_SUBMISSIONS(formProps.id)}
            >
              Submissions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              className="w-full flex cursor-pointer"
              href={ROUTES.ADMIN_FORM_INSIGHTS(formProps.id)}
            >
              Insights
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteFormDialog
        formId={formProps.id}
        onDone={onDeleteCompleted}
        open={open}
        onClose={hide}
      />
    </>
  );
};

export default ActionButtons;
