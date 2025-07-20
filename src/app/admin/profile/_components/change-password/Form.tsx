'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChangePasswordForm as TChangePasswordForm,
  ChangePasswordSchema,
} from '@/types/auth/change-password';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect } from 'react';
import { requestPasswordChange } from '@/app/admin/profile/utils';

export default function ChangePasswordForm() {
  const { data: session } = useSession();
  const { setPageTitle } = useSidebar();

  const form = useForm<TChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: TChangePasswordForm) => {
    try {
      const res = await requestPasswordChange(data);

      if (res.status === 'success') {
        toast.success('Password changed successfully.');
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Network error. Please try again later.');
    }
  };

  useEffect(() => {
    setPageTitle('Profile');
  }, [setPageTitle]);

  if (!session) return <div>Loading your profile...</div>;

  return (
    <div className="max-w-md mx-auto mt-12 space-y-4">
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
            <Button
              tabIndex={1}
              type="submit"
              className="justify-self-center-safe w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'Change password'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
