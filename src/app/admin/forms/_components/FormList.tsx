'use client';

import { useEffect, useState, useCallback } from 'react';
import { FormCard } from './FormCard';
import { EmptyState } from './EmptyState';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { FormListItem } from '@/app/admin/forms/types';
import { Pagination } from '@/components/shared/Pagination';
import Filters from './Filters';
import { API_ROUTES } from '@/contants/routes';

const LIMIT = 20;

export function FormsList() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebounce(rawSearch, 500);
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [order, setOrder] = useState<'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc'>('createdAt_asc');
  const [page, setPage] = useState(1);

  const fetchForms = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(status !== 'all' && { status }),
      ...(order && { order }),
      page: String(page),
      limit: String(LIMIT),
    });
    const res = await fetch(`${API_ROUTES.FORMS}?${params.toString()}`);
    const data = await res.json();
    setForms(data.forms || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [search, status, page, order]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  useEffect(() => {
    setPage(1);
  }, [search, status, order]);

  const showEmpty = !loading && forms.length === 0;

  return (
    <div>
      <Filters
        search={rawSearch}
        onSearchChange={setRawSearch}
        status={status}
        order={order}
        onOrderChange={setOrder}
        onStatusChange={setStatus}
        onCreate={fetchForms}
      />

      {loading ? (
        <div className="py-12 text-center">Loading...</div>
      ) : showEmpty ? (
        <EmptyState onCreate={fetchForms} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:grid-cols-1">
            {forms.map(form => (
              <FormCard key={form.id} form={form} refetch={fetchForms} />
            ))}
          </div>
          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
