'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import { Eye, EyeOffIcon } from 'lucide-react';
import Loader from '@/components/ui/loader';
import { API_ROUTES } from '@/contants/routes';

export function PublishFormButton({
                                    formId,
                                    isPublished,
                                    size = 'default',
                                    onDone,
                                    loading,
                                    setLoading,
                                  }: {
  formId: string;
  isPublished: boolean;
  size?: 'default' | 'icon';
  onDone?: () => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}) {
  const [internalLoading, setInternalLoading] = useState(false);
  const busy = loading !== undefined ? loading : internalLoading;

  const handlePublish = async () => {
    try {
      setLoading?.(true);
      setInternalLoading(true);
      const res = await fetch(`${API_ROUTES.FORMS}/${formId}/publish`, {
        method: 'POST',
        body: JSON.stringify({ isPublished: !isPublished }),
        headers: { 'Content-Type': 'application/json' },
      });
      setLoading?.(false);
      setInternalLoading(false);

      if (res.ok) {
        toast.success(isPublished ? 'Form unpublished' : 'Form published');
        onDone?.();
      } else {
        toast.error('Failed to change publish status');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <Button
      onClick={handlePublish}
      variant={size === 'icon' ? 'outline' : isPublished ? 'secondary' : 'default'}
      size={size}
      aria-label={isPublished ? 'Unpublish form' : 'Publish form'}
      disabled={busy}
      type="button"
    >
      {isPublished ? (
        <>
          {size === 'icon' ? (busy ? <Loader /> : <EyeOffIcon className="w-4 h-4" />) :
            <EyeOffIcon className="w-4 h-4" />}
          {size !== 'icon' && <span className="ml-2">{busy ? 'Wait...' : 'Unpublish'}</span>}
        </>
      ) : (
        <>
          {size === 'icon' ? (busy ? <Loader /> : <Eye className="w-4 h-4" />) :
            <Eye className="w-4 h-4" />}
          {size !== 'icon' && <span className="ml-2">{busy ? 'Wait...' : 'Publish'}</span>}
        </>
      )}
    </Button>
  );
}
