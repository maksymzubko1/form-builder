import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Submission } from '@/types/submissions';

export const submissionsColumns: ColumnDef<Submission>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'submittedAt',
    header: 'Date',
    cell: ({ row }) => new Date(row.original.submittedAt).toLocaleString(),
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row, table }) => {
      const submission = row.original;
      const { setSelected, handleDelete } = table.options.meta as {
        setSelected: (s: Submission) => void;
        handleDelete: (id: string) => void;
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-8 w-8">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelected(submission)}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(submission.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];
