'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterForm as TRegisterForm, RegisterSchema } from '@/types/auth/register';
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
import { ERegisterStatus } from '@/app/register/types';
import { useRouter } from 'next/navigation';
import { requestRegister } from '@/app/register/utils';

export default function RegisterForm() {
  const { push } = useRouter();
  const form = useForm<TRegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      password: '',
      email: '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: TRegisterForm) => {
    try {
      const res = await requestRegister(data);

      if (res.status === 'success') {
        push(`${ROUTES.REGISTER}?status=${ERegisterStatus.SUCCESS}`);
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
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-16 space-y-4">
        <h1 className="text-2xl font-bold">Registration</h1>
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
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input tabIndex={1} placeholder="***" autoFocus type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center text-sm">
          <Button
            tabIndex={2}
            type="submit"
            className="justify-self-center-safe w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Loading...' : 'Register'}
          </Button>
        </div>
        <div className="text-sm text-center">
          Already have an account?{' '}
          <a tabIndex={3} href={ROUTES.LOGIN} className="text-blue-700 underline">
            Login
          </a>
        </div>
      </form>
    </Form>
  );
}
