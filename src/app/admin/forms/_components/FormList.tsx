'use client';

import { useEffect, useState } from 'react';
import { FormListItem } from '@/app/admin/forms/types';
import { FormCard } from './FormCard';
import { FormCreateButton } from './FormCreateButton';
import { EmptyState } from './EmptyState';
import { toast } from 'sonner';

export default function FormsList() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await fetch('/api/forms');
        if (res.ok) {
          const data = await res.json();
          setForms(data.forms || []);
        } else {
          toast.error('Failed to fetch forms.');
        }
      } catch {
        toast.error('Network problem occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  if (loading) return <div className="py-12 text-center">Loading...</div>;

  if (!forms.length) return <EmptyState />;

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <FormCreateButton />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map(form => (
          <FormCard key={form.id} form={form} />
        ))}
      </div>
    </div>
  );
}
