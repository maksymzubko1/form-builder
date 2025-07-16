import type { ColumnDef } from '@tanstack/react-table';
import type { FormListItem } from '@/app/admin/forms/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { PublishFormButton } from '@/app/admin/forms/_components/actions/PublishFormButton';
import { CopyFormButton } from '@/app/admin/forms/_components/actions/CopyFormButton';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { DeleteFormAction } from '@/app/admin/forms/_components/actions/DeleteFormAction';
import React from 'react';

export const formsColumns: ColumnDef<FormListItem>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => <span className="font-semibold">{row.original.title}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString(),
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) =>
      row.original.isPublished ? (
        <span className="text-green-600 font-medium">Published</span>
      ) : (
        <span className="text-muted-foreground">Draft</span>
      ),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row, table }) => {
      const form = row.original;
      const { onEdit, onDelete, onPublish, onCopy } = table.options.meta as {
        onEdit: (form: FormListItem) => void;
        onDelete: (form: FormListItem) => void;
        onPublish: (form: FormListItem) => void;
        onCopy: (form: FormListItem) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="w-full flex cursor-pointer" href={ROUTES.FORM(form.id)} target="_blank">
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="w-full flex cursor-pointer" href={ROUTES.ADMIN_FORM_PREVIEW(form.id)}>
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <button onClick={() => onEdit(form)} className="w-full flex">Edit</button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <PublishFormButton
                formId={form.id}
                isPublished={form.isPublished}
                size="default"
                onDone={() => onPublish(form)}
                asDropdown
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyFormButton
                formId={form.id}
                size="default"
                onCopy={() => onCopy(form)}
                asDropdown
              />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteFormAction
                onClick={() => onDelete(form)}
                size="default"
                asDropdown
              />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link className="w-full flex cursor-pointer" href={ROUTES.ADMIN_FORM_SUBMISSIONS(form.id)}>
                Submissions
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link className="w-full flex cursor-pointer" href={ROUTES.ADMIN_FORM_INSIGHTS(form.id)}>
                Insights
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
