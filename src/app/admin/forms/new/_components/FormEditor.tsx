'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, FormType } from '@/types/forms/forms';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import PuckEditorForm from '@/components/shared/PuckEditor/PuckEditor';
import { Data } from '@measured/puck';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useSidebar } from '@/components/ui/sidebar';
import { requestCreateForm } from '@/app/admin/forms/new/utils';
import Error from '@/app/admin/forms/new/_components/Error';

export function FormEditor() {
  const { setPageTitle } = useSidebar();
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', description: '', emailNotification: false, content: {} },
  });

  const {
    setValue,
    handleSubmit,
    getValues,
    formState: { isSubmitting, errors },
  } = form;
  const { content } = getValues();

  const onSubmit = async (data: FormType) => {
    try {
      setLoading(true);
      const res = await requestCreateForm(data);

      if (res.status === 'success') {
        router.push(`${ROUTES.ADMIN_FORMS}/${res.data?.form.id}`);
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const onPublish = (data: Data) => {
    setValue('content', data);
    setValue('title', data.root.props?.title);
    setValue('emailNotification', data.root.props?.emailNotification);
    setValue('description', data.root.props?.description);

    submitButtonRef.current?.click();
  };

  useEffect(() => {
    setPageTitle('Create Form');
  }, [setPageTitle]);

  return (
    <div className="flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-4 w-full" noValidate>
          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="hidden"
            style={{ display: 'none' }}
            ref={submitButtonRef}
          >
            {isSubmitting ? 'Creating...' : 'Create Form'}
          </Button>
        </form>
      </Form>

      <div className="flex flex-col gap-2">
        <Error errors={errors} />
        <PuckEditorForm content={content} onPublish={onPublish} isLoading={loading} />
      </div>
    </div>
  );
}
