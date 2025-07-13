'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordForm as TChangePasswordForm, ChangePasswordSchema } from './schema';
import { useSession } from 'next-auth/react';
import { API_ROUTES } from '@/contants/routes';
import z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ChangePasswordForm() {
  const { data: session } = useSession();

  const form = useForm<TChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const { handleSubmit, control, formState: { isSubmitting } } = form;

  const onSubmit = async (data: z.infer<typeof ChangePasswordSchema>) => {
    try {
      const res = await fetch(API_ROUTES.CHANGE_PASSWORD, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        toast.success('Password changed successfully.');
      } else {
        const json = await res.json();
        toast.error(json.message || 'Something went wrong');
      }
    } catch {
      toast.error('Network error. Please try again later.');
    }
  };

  if (!session) return <div>Loading your profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-4">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div>Email: {session.user.email}</div>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input tabIndex={0} autoFocus placeholder="***" {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center text-sm">
            <Button tabIndex={1} type="submit" className="justify-self-center-safe w-full"
                    disabled={isSubmitting}>{isSubmitting ? 'Loading...' : 'Change password'}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
