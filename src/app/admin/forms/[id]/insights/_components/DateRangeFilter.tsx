'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
}

export function DateRangeFilter({ from, to, setFrom, setTo }: DateRangeFilterProps) {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <div className="grid max-w-xs items-center gap-3">
        <Label htmlFor="from">From</Label>
        <Input type="date" value={from || ''}
               onChange={e => setFrom(e.target.value)} className="w-[240px]" />
      </div>
      <div className="grid max-w-xs items-center gap-3">
        <Label htmlFor="from">To</Label>
        <Input type="date" value={to || ''}
               onChange={e => setTo(e.target.value)} className="w-[240px]" />
      </div>
    </div>
  );
}
