'use client';

import Loader from '@/components/ui/loader';
import { Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteFormActionProps {
  size?: 'default' | 'icon';
  asDropdown?: boolean;
  onClick: () => void;
  loading?: boolean;
}

export function DeleteFormAction({ size, asDropdown, onClick, loading }: DeleteFormActionProps) {
  if (asDropdown) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        aria-label="Delete form"
        className="w-full flex text-destructive"
      >
        Delete
      </button>
    );
  }

  return (
    <Button
      variant="destructive"
      size={size}
      aria-label="Delete form"
      className="dark:bg-destructive bg-destructive"
      type="button"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? <Loader /> : <Trash2Icon className="w-4 h-4" />}
      {size !== 'icon' && <span className="ml-2">{loading ? 'Wait...' : 'Delete'}</span>}
    </Button>
  );
}