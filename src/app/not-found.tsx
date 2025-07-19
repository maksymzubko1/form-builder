import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Sorry, we couldn&#39;t find that page.<br />
        Try checking the URL or return to the home page.
      </p>
      <Button asChild>
        <Link href={ROUTES.HOME} className="btn btn-primary">Go Home</Link>
      </Button>
    </div>
  );
}
