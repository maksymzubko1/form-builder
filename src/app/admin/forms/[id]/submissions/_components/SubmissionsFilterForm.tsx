'use client';

import { useState } from "react";
import type { FC, ChangeEvent } from "react";
import type { SubmissionsFilter } from "../types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchInput } from '@/components/shared/SearchInput';

interface SubmissionsFilterFormProps {
  onChange: (filter: SubmissionsFilter) => void;
}

export const SubmissionsFilterForm: FC<SubmissionsFilterFormProps> = ({ onChange }) => {
  const [email, setEmail] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  function handleApply(): void {
    onChange({
      ...(email && { email }),
      ...(from && { from }),
      ...(to && { to }),
    });
  }

  return (
    <div className="flex gap-2">
      <SearchInput
        placeholder="Email"
        value={email}
        className="w-auto"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        onClear={() => setEmail('')}
      />
      <Input
        type="date"
        value={from}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setFrom(e.target.value)}
      />
      <Input
        type="date"
        value={to}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setTo(e.target.value)}
      />
      <Button type="button" onClick={handleApply}>
        Filter
      </Button>
    </div>
  );
};
