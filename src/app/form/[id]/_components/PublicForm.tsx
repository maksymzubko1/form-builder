'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Data } from '@measured/puck';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import PuckRender from '@/components/shared/PuckEditor/PuckRender';
import { Input } from '@/components/ui/input';
import { API_ROUTES, ROUTES } from '@/contants/routes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { extractFields, makeFormSchema } from '@/types/public-forms';
import { EFromStatus } from '@/app/form/[id]/types';
import Loader from '@/components/ui/loader';
import { validateAndPrepareData } from '@/app/form/[id]/utils';

type Props = {
  form: {
    id: string;
    title: string;
    description?: string;
    content: Data
  },
  email: string;
}

export function PublicForm({ form, email }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDraft, setLoadingDraft] = useState<boolean>(false);
  const [fetchingDraft, setFetchingDraft] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { push } = useRouter();
  const fields = extractFields(form.content);

  const schema = makeFormSchema(fields);
  type FormType = z.infer<typeof schema>;

  const [defaultValues, setDefaultValues] = useState<Record<string, string>>({
    email: email, ...fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as Record<string, string>),
  });

  const _form = useForm<FormType>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit',
    shouldUseNativeValidation: true,
    defaultValues,
  });

  const { clearErrors, reset, setError, control, formState: { errors, isSubmitting } } = _form;

  useEffect(() => {
    const fetchDraftData = async () => {
      setFetchingDraft(true);
      try {
        const res = await fetch(`${API_ROUTES.PUBLIC_FORMS_DRAFT(form.id)}?email=${encodeURIComponent(email)}`);
        if (res.ok) {
          const json = await res.json();
          if(!json.draft) return;

          setDefaultValues(prev=>({...prev, ...json.draft}))
          reset({ email, ...json.draft });
          toast.info('Found your saved progress. Continue filling the form.');
        } else {
          const json = await res.json();
          toast.error(json?.error || 'Unhandled error');
          reset({ email });
        }
      } catch {
        toast.error('Network Error');
      } finally {
        setFetchingDraft(false);
      }
    };

    if (email && form.id) {
      fetchDraftData();
    }
  }, [email, form.id, reset]);

  const onSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();
    clearErrors();

    try {
      const payload = await validateAndPrepareData({
        data: new FormData(e.target as HTMLFormElement),
        schema,
        setError,
        needValidate: true,
      });

      if (!payload) {
        toast.error('Error submitting form');
        return;
      }

      const res = await fetch(`${API_ROUTES.PUBLIC_FORMS}/${form.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ data: payload, fields }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        push(`${ROUTES.FORM(form.id)}?status=${EFromStatus.SENT}`);
      } else {
        const json = await res.json();
        toast.error(json.error || 'Error submitting form');
      }
    } catch {
      toast.error('Unhandled submitting form error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setLoadingDraft(true);

      if (!formRef.current) {
        return;
      }

      const payload = await validateAndPrepareData({
        data: new FormData(formRef.current),
        schema,
        setError,
        needValidate: false,
      });

      if (!payload) {
        toast.error('Failed to draft form');
        return;
      }

      const res = await fetch(API_ROUTES.PUBLIC_FORMS_DRAFT(form.id), {
        method: 'POST',
        body: JSON.stringify({ email: payload.email, data: payload }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        push(`${ROUTES.FORM(form.id)}?status=${EFromStatus.DRAFT}`);
      } else {
        toast.error('Failed to save draft');
      }
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setLoadingDraft(false);
    }
  };

  if (fetchingDraft) {
    return <div className="text-center py-16"><Loader /> Loading your saved progress...</div>;
  }

  return (
    <Form {..._form}>
      <form ref={formRef} onSubmit={onSubmit} noValidate
            className="dark max-w-[1280px] w-full md:mx-auto md:my-12 p-6 bg-muted md:rounded shadow space-y-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 ">{form.title}</h1>
        {form.description && <p className="text-muted-foreground mb-4">{form.description}</p>}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="pr-3 pl-3 pb-8 border-b-[1px]">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input readOnly tabIndex={0} className="text-muted bg-muted" placeholder="user@gmail.com"
                       autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <PuckRender content={form.content} errors={errors} defaultValues={defaultValues} />
        <div className="flex gap-2 mt-4 justify-center">
          <Button
            type="button"
            variant="secondary"
            className="bg-neutral-700 hover:bg-neutral-700 hover:opacity-90"
            onClick={handleSaveDraft}
            disabled={isSubmitting || loadingDraft}
          >
            {(isSubmitting || loadingDraft) ? 'Saving...' : 'Save and continue later'}
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {(isSubmitting || loading) ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
