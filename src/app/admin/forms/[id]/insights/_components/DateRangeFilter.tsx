'use client';

import { Input } from '@/components/ui/input';

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  setFrom: (v: string) => void;
  setTo: (v: string) => void;
}

export function DateRangeFilter({ from, to, setFrom, setTo }: DateRangeFilterProps) {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <span className="text-muted-foreground">From</span>
      <Input type="date" value={from || ''} onChange={e => setFrom(e.target.value)} className="w-[240px]" />
      <span className="text-muted-foreground">to</span>
      <Input type="date" value={to || ''} onChange={e => setTo(e.target.value)} className="w-[240px]" />
    </div>
  );
}
