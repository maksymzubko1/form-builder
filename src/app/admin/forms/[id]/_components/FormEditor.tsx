'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormSchema, FormType } from '@/types/forms';
import { toast } from 'sonner';
import PuckEditorForm from '@/components/shared/PuckEditor/PuckEditor';
import { Data } from '@measured/puck';
import { Form } from '@/components/ui/form';
import { API_ROUTES } from '@/constants/routes';
import { useSidebar } from '@/components/ui/sidebar';

interface FormEditorProps {
  initialForm: FormType & { id: string; isPublished: boolean };
}

export function FormEditor({ initialForm }: FormEditorProps) {
  const {setPageTitle} = useSidebar()
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: initialForm.title || '',
      description: initialForm.description || '',
      emailNotification: initialForm.emailNotification || false,
      content: initialForm.content || {},
    },
  });

  const { setValue, handleSubmit, getValues, formState: { errors, isSubmitting }, reset } = form;
  const { content } = getValues();

  const onSubmit = async (data: FormType) => {
    try {
      setLoading(true);
      toast.info('Saving...');
      const res = await fetch(`${API_ROUTES.FORMS}/${initialForm.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...data }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        toast.success('Form updated!');
        const json = await res.json();
        reset({ ...json.form, content: json.form.content || {} });
      } else {
        const json = await res.json();
        toast.error(json.error || 'Failed to update form');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onPublish = (data: Data) => {
    setValue('content', data);
    setValue('title', data.root.props?.title);
    setValue('emailNotification', data.root.props?.emailNotification)
    setValue('description', data.root.props?.description);

    submitButtonRef.current?.click();
  };

  useEffect(() => {
    setPageTitle('Edit Form');
  }, [setPageTitle]);

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="flex gap-2">
            <Button ref={submitButtonRef} style={{ display: 'none' }} className="hidden" type="submit"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex flex-col">
        <label className={`block text-sm ${errors.content ? 'text-destructive' : ''} font-medium mb-3`}>Form
          Content</label>
        <div className="error mb-2 flex flex-col">
          {errors.title && <span className="text-destructive text-sm">{errors.title.message}</span>}
          {errors.description && <span className="text-destructive text-sm">{errors.description.message}</span>}
          {errors.content && <span className="text-destructive text-sm">{errors.content.message}</span>}
        </div>
        <PuckEditorForm isLoading={loading} content={content} onPublish={onPublish} isEditing
                        formProps={{ id: initialForm.id, isPublished: initialForm.isPublished }} />
      </div>
    </div>
  );
}
