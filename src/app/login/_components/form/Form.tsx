'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginForm as TLoginForm, LoginSchema, ELoginResponseTypes } from '@/types/login';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
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
import { z } from 'zod';
import { toast } from 'sonner';

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<TLoginForm>({
    resolver: zodResolver(LoginSchema),
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

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        ...data,
      });
      if (res?.error) {
        toast.error(
          ELoginResponseTypes[res.error as keyof typeof ELoginResponseTypes] || 'Unknown error',
        );
      } else router.push(ROUTES.ADMIN);
    } catch {
      toast.error('Network error. Please try again later.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto mt-16 space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input tabIndex={0} autoFocus placeholder="user@gmail.com" {...field} />
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
                <Input tabIndex={1} autoFocus placeholder="***" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button tabIndex={3} type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Loading...' : 'Log in'}
        </Button>
        <div className="flex justify-between text-sm">
          <a tabIndex={4} href={ROUTES.RESET} className="text-blue-700 underline">
            Forgot your password?
          </a>
          <a tabIndex={5} href={ROUTES.REGISTER} className="text-blue-700 underline">
            Registration
          </a>
        </div>
      </form>
    </Form>
  );
}
