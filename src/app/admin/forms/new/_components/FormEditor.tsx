'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema, FormType } from '@/types/forms';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import PuckEditorForm from '@/components/shared/PuckEditor/PuckEditor';

export function FormEditor({ mode = 'create' }: { mode: 'create' | 'edit' }) {
  const router = useRouter();
  const [content, setContent] = useState<unknown>({});

  const form = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', description: '', content: {} },
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = async (data: FormType) => {
    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        body: JSON.stringify({ ...data, content }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const json = await res.json();
        router.push(`/admin/forms/${json.form.id}`);
      } else {
        const json = await res.json();
        toast.error(json.error || 'Failed to create form');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col gap-12">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mx-auto space-y-4 w-full">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input tabIndex={0} placeholder="Title..." autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea tabIndex={1} placeholder="Description..." className='resize-none' autoFocus rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/*<Button*/}
          {/*  type="submit"*/}
          {/*  disabled={isSubmitting}*/}
          {/*  aria-busy={isSubmitting}*/}
          {/*>*/}
          {/*  {isSubmitting ? 'Creating...' : 'Create Form'}*/}
          {/*</Button>*/}
        </form>
      </Form>

      <PuckEditorForm content={content as never} setContent={setContent} />
    </div>
  );
}
