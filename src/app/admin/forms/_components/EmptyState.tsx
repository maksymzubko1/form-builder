import { Button } from '@/components/ui/button';

export function EmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="py-24 text-center">
      <p className="text-lg mb-4">No forms found</p>
      <Button onClick={onCreate}>Create your first form</Button>
    </div>
  );
}
