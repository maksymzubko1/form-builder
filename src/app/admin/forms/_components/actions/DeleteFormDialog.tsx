'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import Loader from '@/components/ui/loader';
import { API_ROUTES } from '@/constants/routes';

interface DeleteFormDialogProps {
  formId: string;
  onDone?: () => void;
  open?: boolean;
  onClose?: () => void;
}

export function DeleteFormDialog({ formId, open, onClose, onDone }: DeleteFormDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ROUTES.FORMS}/${formId}`, { method: 'DELETE' });

      if (res.ok) {
        toast.success('Form deleted');
        onDone?.();
      } else {
        toast.error('Failed to delete form');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this form?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All form data will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={handleDelete}
          >
            {loading ? <Loader className="mr-2" /> : null}
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
