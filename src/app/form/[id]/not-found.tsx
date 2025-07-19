import Link from 'next/link';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';

export default function PublicFormNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-3xl font-bold mb-2">Form Not Found</h1>
      <p className="text-muted-foreground mb-6">
        This form does not exist or is no longer available.<br />
        Please check your link or contact the form owner.
      </p>
      <Button asChild>
        <Link href={ROUTES.HOME} className="btn btn-secondary">Return to Home</Link>
      </Button>
    </div>
  );
}
