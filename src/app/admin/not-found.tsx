import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';

export default function AdminNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-4">404 — Not Found</h1>
      <p className="text-muted-foreground mb-6">
        This page does not exist in the admin panel.<br />
        Check your URL or use the menu.
      </p>
      <Button variant="link">
        <Link href={ROUTES.ADMIN} className="btn btn-primary">Go to Admin Dashboard</Link>
      </Button>
    </div>
  );
}
