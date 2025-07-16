import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ROUTES } from '@/constants/routes';

export const metadata = {
  title: 'Smart Form Builder',
  description: 'Create, publish, and analyze smart forms with AI assistant. Start for free!'
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <h1 className="text-3xl font-bold mb-4">Form Builder AI</h1>
      <p className="text-gray-600 mb-8">Create and analyze forms with the help of an AI assistant</p>
      <Button tabIndex={0} asChild>
        <Link href={ROUTES.ADMIN}>Get started</Link>
      </Button>
    </div>
  );
}
