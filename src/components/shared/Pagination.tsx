import { Button } from '@/components/ui/button';

type Props = {
  page: number; total: number; limit: number; onPageChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onPageChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4 items-center justify-center">
      <Button variant="outline" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Prev</Button>
      <span>
        Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
      </span>
      <Button variant="outline" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</Button>
    </div>
  );
}
