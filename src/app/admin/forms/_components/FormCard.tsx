'use client';

import { FormListItem } from '@/app/admin/forms/types';
import Link from 'next/link';

export function FormCard({ form }: { form: FormListItem }) {
  return (
    <div className="rounded-lg shadow p-4 bg-white flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">{form.title}</span>
        {form.isPublished && (
          <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Published
          </span>
        )}
      </div>
      <div className="text-gray-600 text-sm">{form.description}</div>
      <div className="text-xs text-gray-400">
        Updated: {new Date(form.updatedAt).toLocaleString()}
      </div>
      <div className="flex gap-2 mt-2">
        <Link href={`/admin/forms/${form.id}`}>
          <button className="btn btn-secondary" aria-label="Edit form">Edit</button>
        </Link>
        <Link href={`/form/${form.id}`} target="_blank">
          <button className="btn btn-outline" aria-label="View public form">View</button>
        </Link>
        {/* Действия: удалить, копировать, publish/unpublish — добавим дальше */}
      </div>
    </div>
  );
}
