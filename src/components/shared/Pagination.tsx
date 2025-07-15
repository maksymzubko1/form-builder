import { Button } from '@/components/ui/button';
import {
  Pagination as _Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  page: number; total: number; limit: number; onPageChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onPageChange }: Props) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  return (
    <_Pagination className="mt-4 flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious className="cursor-pointer"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            aria-disabled={page === 1}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <Button
              variant={page === i + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Button>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext className="cursor-pointer"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            aria-disabled={page === totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </_Pagination>
  );
}
