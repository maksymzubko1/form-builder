'use client';

import { FormCreateButton } from './FormCreateButton';

export function EmptyState() {
  return (
    <div className="py-24 text-center">
      <p className="text-lg mb-4">No forms yet</p>
      <FormCreateButton />
    </div>
  );
}
