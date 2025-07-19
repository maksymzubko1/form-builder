'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CopyIcon } from 'lucide-react';
import { useState } from 'react';
import Loader from '@/components/ui/loader';
import { API_ROUTES, ROUTES } from '@/constants/routes';

interface CopyFormButtonProps {
  formId: string;
  size?: 'default' | 'icon';
  asDropdown?: boolean;
  onCopy?: () => void;
}

export function CopyFormButton({
  formId,
  size = 'default',
  asDropdown,
  onCopy,
}: CopyFormButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    try {
      toast.info('Coping...');
      setLoading(true);
      const res = await fetch(`${API_ROUTES.FORMS}/${formId}/copy`, { method: 'POST' });
      if (res.ok) {
        const { form } = await res.json();
        toast.success('Form copied! Redirecting...');
        router.push(`${ROUTES.ADMIN_FORMS}/${form.id}`);
        onCopy?.();
      } else {
        toast.error('Failed to copy form');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (asDropdown) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        disabled={loading}
        aria-label="Copy form"
        className="w-full flex"
      >
        Copy
      </button>
    );
  }

  return (
    <Button
      onClick={handleCopy}
      variant={size === 'icon' ? 'outline' : 'secondary'}
      size={size}
      aria-label="Copy form"
      type="button"
      disabled={loading}
    >
      {loading ? <Loader /> : <CopyIcon className="w-4 h-4" />}
      {size !== 'icon' && <span className="ml-2">{loading ? 'Wait...' : 'Copy'}</span>}
    </Button>
  );
}
