import LoginForm from './_components/form/Form';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your account to manage and create forms with AI assistant.',
  robots: 'noindex'
};

export default function LoginPage() {
  return (
    <LoginForm />
  );
}
