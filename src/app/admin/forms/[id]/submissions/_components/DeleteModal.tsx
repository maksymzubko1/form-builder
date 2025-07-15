import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export type DeleteTarget = { type: 'one'; id: string } | { type: 'all' } | null;

interface Props {
  open: boolean;
  deleteTarget: DeleteTarget;
  onDelete: () => void;
  onClose: () => void;
}

const DeleteModal = ({deleteTarget, onDelete, open, onClose}: Props) => {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deleteTarget?.type === 'all'
              ? 'Delete all submissions?'
              : 'Delete this submission?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleteTarget?.type === 'all'
              ? 'Are you sure you want to delete all submissions for this form? This cannot be undone.'
              : 'Are you sure you want to delete this submission? This cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              type="button"
              variant="destructive"
              className="dark:bg-destructive bg-destructive"
              onClick={onDelete}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteModal;