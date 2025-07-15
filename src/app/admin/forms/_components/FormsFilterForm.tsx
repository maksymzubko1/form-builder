'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FC } from 'react';
import { FormCreateButton } from '@/app/admin/forms/_components/actions/FormCreateButton';
import { SearchInput } from '@/components/shared/SearchInput';

interface FormsFilterFormProps {
  search: string;
  onSearchChange: (val: string) => void;
  status: 'all' | 'published' | 'draft';
  onStatusChange: (val: 'all' | 'published' | 'draft') => void;
  order: 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc';
  onOrderChange: (val: FormsFilterFormProps['order']) => void;
}

export const FormsFilterForm: FC<FormsFilterFormProps> = ({
                                                            search,
                                                            onSearchChange,
                                                            status,
                                                            onStatusChange,
                                                            order,
                                                            onOrderChange,
                                                          }) => {
  return (
    <div className="flex flex-wrap gap-2 items-center mb-6 justify-between">
      <div className="flex flex-wrap grow-1 gap-2 items-center">
        <SearchInput
          placeholder="Search forms..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onClear={() => onSearchChange('')}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={v => onStatusChange(v as typeof status)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={order} onValueChange={v => onOrderChange(v as typeof order)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt_desc">Created ↓</SelectItem>
            <SelectItem value="createdAt_asc">Created ↑</SelectItem>
            <SelectItem value="updatedAt_desc">Updated ↓</SelectItem>
            <SelectItem value="updatedAt_asc">Updated ↑</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <FormCreateButton />
    </div>
  );
};
