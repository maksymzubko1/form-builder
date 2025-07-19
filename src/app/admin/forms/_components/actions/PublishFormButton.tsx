'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Eye, EyeOffIcon } from 'lucide-react';
import Loader from '@/components/ui/loader';
import { requestPublishForm } from '@/app/admin/forms/utils';

interface PublishFormButtonProps {
  formId: string;
  isPublished: boolean;
  size?: 'default' | 'icon';
  onDone?: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
  asDropdown?: boolean;
}

export function PublishFormButton({
  formId,
  isPublished,
  size = 'default',
  onDone,
  loading,
  setLoading,
  asDropdown,
}: PublishFormButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const busy = loading !== undefined ? loading : internalLoading;

  const handlePublish = async () => {
    try {
      setLoading?.(true);
      setInternalLoading(true);
      const res = await requestPublishForm(formId, isPublished);

      setLoading?.(false);
      setInternalLoading(false);

      if (res.status === 'success') {
        toast.success(isPublished ? 'Form unpublished' : 'Form published');
        onDone?.();
      } else {
        toast.error('Failed to change publish status');
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Network error. Please try again later.');
    }
  };

  if (asDropdown) {
    return (
      <button
        type="button"
        onClick={handlePublish}
        disabled={loading}
        aria-label={isPublished ? 'Unpublish form' : 'Publish form'}
        className="w-full flex"
      >
        {isPublished ? 'Unpublish' : 'Publish'}
      </button>
    );
  }

  return (
    <Button
      onClick={handlePublish}
      variant={size === 'icon' ? 'outline' : isPublished ? 'secondary' : 'default'}
      size={size}
      aria-label={isPublished ? 'Unpublish form' : 'Publish form'}
      disabled={busy}
      type="button"
    >
      {busy ? (
        <Loader />
      ) : isPublished ? (
        <EyeOffIcon className="w-4 h-4" />
      ) : (
        <Eye className="w-4 h-4" />
      )}
      {size !== 'icon' && (
        <span className="ml-2">{busy ? 'Wait...' : isPublished ? 'Unpublish' : 'Publish'}</span>
      )}
    </Button>
  );
}
