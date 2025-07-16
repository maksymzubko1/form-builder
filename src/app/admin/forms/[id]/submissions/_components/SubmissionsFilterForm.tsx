'use client';

import { useState } from 'react';
import type { FC, ChangeEvent } from 'react';
import type { SubmissionsFilter } from '../types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/shared/SearchInput';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Order = 'submittedAt_desc' | 'submittedAt_asc';

interface SubmissionsFilterFormProps {
  onChange: (filter: SubmissionsFilter) => void;
}

export const SubmissionsFilterForm: FC<SubmissionsFilterFormProps> = ({ onChange }) => {
  const [email, setEmail] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [order, setOrder] = useState<Order>('submittedAt_desc');

  function handleApply(): void {
    onChange({
      ...(email && { email }),
      ...(from && { from }),
      ...(to && { to }),
      ...(order && { order }),
    });
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex gap-2 items-end flex-wrap">
        <div className="grid max-w-xs items-center gap-3">
          {/*<Label htmlFor="email">User email</Label>*/}
          <SearchInput
            id="email"
            placeholder="your@email.com"
            value={email}
            className="w-full"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            onClear={() => setEmail('')}
          />
        </div>
        <div className="grid max-w-xs items-center gap-3">
          <Label htmlFor="from">From</Label>
          <Input
            id="from"
            type="date"
            value={from}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value)}
          />
        </div>
        <div className="grid max-w-xs items-center gap-3">
          <Label htmlFor="to">To</Label>
          <Input
            id="to"
            type="date"
            value={to}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value)}
          />
        </div>
        <Select value={order} onValueChange={v => setOrder(v as typeof order)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="submittedAt_desc">Submitted ↓</SelectItem>
            <SelectItem value="submittedAt_asc">Submitted ↑</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="button" onClick={handleApply}>
        Filter
      </Button>
    </div>
  );
};
