'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResetTokenForm as TResetTokenForm, ResetTokenSchema } from '@/types/auth/reset-password';
import { useParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
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
import { requestPasswordResetByToken } from '@/app/reset-password/[token]/utils';

export default function ResetTokenForm() {
  const params = useParams<{ token: string }>();
  const router = useRouter();

  const form = useForm<TResetTokenForm>({
    resolver: zodResolver(ResetTokenSchema),
    defaultValues: {
      password: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isSubmitSuccessful },
  } = form;

  const onSubmit = async (data: TResetTokenForm) => {
    try {
      const res = await requestPasswordResetByToken(params.token, data);

      if (res.status === 'success') {
        toast.success('Password updated!\n' + 'Redirecting to login page...');
        setTimeout(() => router.push(`${ROUTES.LOGIN}`), 1500);
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-8 space-y-4">
        <h1 className="text-2xl font-bold">Reset password</h1>
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input tabIndex={0} placeholder="***" autoFocus type="password" {...field} />
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
            disabled={isSubmitting || isSubmitSuccessful}
          >
            {isSubmitting ? 'Loading...' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
