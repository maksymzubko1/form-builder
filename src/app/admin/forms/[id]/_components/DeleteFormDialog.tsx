'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { useRouter } from 'next/navigation';
import { Trash2Icon } from 'lucide-react';
import Loader from '@/components/ui/loader';
import { API_ROUTES, ROUTES } from '@/contants/routes';

type Props = {
  formId: string;
  size?: 'default' | 'icon';
  onDone?: () => void;
  cardItem?: boolean;
}

export function DeleteFormDialog({ formId, size = 'default', onDone, cardItem = false }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_ROUTES.FORMS}/${formId}`, { method: 'DELETE' });
      setLoading(false);

      if (res.ok) {
        toast.success('Form deleted');
        if(!cardItem){
          router.push(ROUTES.ADMIN_FORMS);
        }
        onDone?.();
        setOpen(false);
      } else {
        toast.error('Failed to delete form');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <>
      <Button
        variant={size === 'icon' ? 'destructive' : 'destructive'}
        size={size}
        aria-label="Delete form"
        className="dark:bg-destructive bg-destructive"
        type="button"
        onClick={() => setOpen(true)}
        disabled={loading}
      >
        {size === 'icon' ? (loading ? <Loader /> : <Trash2Icon className="w-4 h-4" />) :
          <Trash2Icon className="w-4 h-4" />}
        {size !== 'icon' && <span className="ml-2">{loading ? 'Wait...' : 'Delete'}</span>}
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
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
              {loading ? 'Wait...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}