'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetForm as TResetForm, ResetSchema } from './schema';
import { API_ROUTES, ROUTES } from '@/contants/routes';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EResetPasswordStatus } from '@/app/reset-password/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetForm() {
  const { push } = useRouter();
  const form = useForm<TResetForm>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = async (data: z.infer<typeof ResetSchema>) => {
    try {
      const res = await fetch(API_ROUTES.RESET, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        push(`${ROUTES.RESET}?status=${EResetPasswordStatus.SUCCESS}`);
      } else {
        const json = await res.json();
        toast.error(json.error || 'Unknown error');
      }
    } catch{
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-16 space-y-4">
        <h1 className="text-2xl font-bold">Password recovery</h1>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input tabIndex={0} placeholder="user@gmail.com" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between text-sm">
          <Button tabIndex={2} variant="outline" className="min-w-1/3"
                  disabled={isSubmitting} asChild>
            <Link href={ROUTES.LOGIN}>Back to login</Link>
          </Button>
          <Button tabIndex={1} type="submit" className="min-w-1/3"
                  disabled={isSubmitting}>{isSubmitting ? 'Loading...' : 'Recover'}</Button>
        </div>
      </form>
    </Form>
  );
}
