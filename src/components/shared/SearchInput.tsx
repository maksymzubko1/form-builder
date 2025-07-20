import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchInputProps = {
  onClear: () => void;
} & React.HTMLProps<HTMLInputElement>;

export function SearchInput({ value, onChange, onClear, ...props }: SearchInputProps) {
  return (
    <div className="relative w-64">
      <Input
        value={value}
        onChange={onChange}
        {...props}
        placeholder={props?.placeholder ?? 'Search by title...'}
        className={cn('pr-8', props?.className)}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-inherit text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
          tabIndex={0}
        >
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
