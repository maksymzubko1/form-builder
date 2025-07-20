'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Data } from '@measured/puck';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import PuckRender from '@/components/shared/PuckEditor/PuckRender';
import { Input } from '@/components/ui/input';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { extractFields, makeFormSchema } from '@/lib/public-forms/utils';
import { EFromStatus } from '@/app/form/[id]/types';
import Loader from '@/components/ui/loader';
import {
  requestDraftCreate,
  requestFormDraft,
  requestSubmitForm,
  validateAndPrepareData,
} from '@/app/form/[id]/utils';
import { useTrackFormView } from '@/app/form/[id]/_hooks/useTrackFormView';

type Props = {
  form: {
    id: string;
    title: string;
    description?: string;
    content: Data;
  };
  email: string;
};

export function PublicForm({ form, email }: Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDraft, setLoadingDraft] = useState<boolean>(false);
  const [fetchingDraft, setFetchingDraft] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  // track as view
  useTrackFormView(form.id, email);

  const { push } = useRouter();
  const fields = extractFields(form.content);

  const schema = makeFormSchema(fields);
  type FormType = z.infer<typeof schema>;

  const [defaultValues, setDefaultValues] = useState<Record<string, string>>({
    email: email,
    ...fields.reduce(
      (acc, field) => {
        acc[field.id] = '';
        return acc;
      },
      {} as Record<string, string>,
    ),
  });

  const _form = useForm<FormType>({
    resolver: zodResolver(schema),
    reValidateMode: 'onSubmit',
    shouldUseNativeValidation: true,
    defaultValues,
  });

  const {
    clearErrors,
    getValues,
    reset,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = _form;

  useEffect(() => {
    const fetchDraftData = async () => {
      setFetchingDraft(true);
      try {
        const res = await requestFormDraft(form.id, email);

        if (res.status === 'success') {
          if (res.data) {
            toast.info('Found your saved progress. Continue filling the form.');
            setDefaultValues((prev) => ({ ...prev, ...res.data, email }));
            reset({ ...res.data, email });
          }
        } else {
          toast.error(res.error);
          reset({ email });
        }
      } catch (e: unknown) {
        console.log(e);
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
        state: getValues(),
        schema,
        setError,
        needValidate: true,
        allFields: fields,
      });

      if (!payload) {
        toast.error('Error submitting form');
        return;
      }

      const res = await requestSubmitForm(form.id, payload, fields);

      if (res.status === 'success') {
        push(`${ROUTES.FORM(form.id)}?status=${EFromStatus.SENT}`);
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
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
        state: getValues(),
        needValidate: false,
        allFields: fields,
      });

      if (!payload) {
        toast.error('Failed to draft form');
        return;
      }

      const res = await requestDraftCreate(form.id, payload);

      if (res.status === 'success') {
        push(`${ROUTES.FORM(form.id)}?status=${EFromStatus.DRAFT}`);
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Failed to save draft');
    } finally {
      setLoadingDraft(false);
    }
  };

  if (fetchingDraft) {
    return (
      <div className="text-center py-16">
        <Loader /> Loading your saved progress...
      </div>
    );
  }

  return (
    <Form {..._form}>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        noValidate
        className="dark max-w-[1280px] mt-1 mx-auto w-[98vw] md:w-full md:my-12 p-6 bg-muted md:rounded shadow space-y-6 flex flex-col"
      >
        <h1 className="text-2xl font-bold mb-4 ">{form.title}</h1>
        {form.description && <p className="text-muted-foreground mb-4">{form.description}</p>}
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="pr-3 pl-3 pb-8 border-b-[1px]">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  tabIndex={0}
                  className="text-muted bg-muted"
                  placeholder="user@gmail.com"
                  autoFocus
                  {...field}
                  value={field.value as string}
                />
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
            {isSubmitting || loadingDraft ? 'Saving...' : 'Save and continue later'}
          </Button>
          <Button type="submit" disabled={isSubmitting || loading}>
            {isSubmitting || loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
