import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchInput } from '@/components/shared/SearchInput';
import { FormCreateButton } from '@/app/admin/forms/_components/FormCreateButton';

type Order = 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc'
type Status = 'all' | 'published' | 'draft'

type FormsFilterBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  status: Status;
  order: Order;
  onOrderChange: (v: Order) => void;
  onStatusChange: (v: Status) => void;
  onCreate?: () => void;
  children?: React.ReactNode;
};

export default function Filters({
                                  search,
                                  onSearchChange,
                                  status,
                                  order,
                                  onOrderChange,
                                  onStatusChange,
                                  onCreate,
                                }: FormsFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      <SearchInput
        value={search}
        onChange={e => onSearchChange(e.target.value)}
        onClear={() => onSearchChange('')}
      />
      <Select value={status} onValueChange={v => onStatusChange(v as Status)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select value={order} onValueChange={v => onOrderChange(v as Order)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Filter order" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="createdAt_asc">Created ASC</SelectItem>
          <SelectItem value="createdAt_desc">Created DESC</SelectItem>
          <SelectItem value="updatedAt_asc">Updated ASC</SelectItem>
          <SelectItem value="updatedAt_desc">Updated DESC</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex-1" />
      {onCreate && <FormCreateButton />}
    </div>
  );
}
