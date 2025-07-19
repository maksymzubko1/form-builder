'use client';

import { useEffect, useState, useMemo, JSX } from 'react';
import { formsColumns } from './columns';
import type { FormListItem } from '@/app/admin/forms/types';
import { DataTable } from '@/components/ui/data-table';
import { ROUTES } from '@/constants/routes';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { FormsFilterForm } from './FormsFilterForm';
import { useRouter } from 'next/navigation';
import { Pagination } from '@/components/shared/Pagination';
import { useModal } from '@/lib/hooks/useModal';
import { DeleteFormDialog } from '@/app/admin/forms/_components/actions/DeleteFormDialog';
import { useSidebar } from '@/components/ui/sidebar';
import { requestFormsByParams } from '@/app/admin/forms/utils';

const LIMIT = 20;

export function FormsTable(): JSX.Element {
  const { setPageTitle } = useSidebar();
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [rawSearch, setRawSearch] = useState<string>('');
  const search = useDebounce(rawSearch, 500);
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [order, setOrder] = useState<
    'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc'
  >('createdAt_desc');
  const [page, setPage] = useState<number>(1);
  const { toggle, open, hide } = useModal(false);
  const [selectedItem, setSelectedItem] = useState<FormListItem | null>(null);

  const router = useRouter();

  const fetchForms = async (): Promise<void> => {
    setLoading(true);
    const res = await requestFormsByParams({ status, order, page, limit: LIMIT, search });
    if (res.status === 'success') {
      setForms(res.data?.forms || []);
      setTotal(res.data?.total || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    setPageTitle('My Forms');
  }, [setPageTitle]);

  useEffect(() => {
    fetchForms();
    // eslint-disable-next-line
  }, [search, status, order, page]);

  useEffect(() => {
    setPage(1);
  }, [search, status, order]);

  // Actions
  const onEdit = (form: FormListItem) => {
    router.push(`${ROUTES.ADMIN_FORMS}/${form.id}`);
  };
  const onPublish = () => {
    fetchForms();
  };
  const onDelete = (form: FormListItem) => {
    setSelectedItem(form);
    toggle();
  };
  const onDeleteCompleted = () => {
    fetchForms();
  };
  const onCopy = () => {
    // fetchForms();
  };
  const onPageChange = (page: number) => {
    setPage(page);
  };

  const tableMeta = useMemo(
    () => ({
      onEdit,
      onDelete,
      onPublish,
      onCopy,
    }),
    // eslint-disable-next-line
    [],
  );

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      <FormsFilterForm
        search={rawSearch}
        onSearchChange={setRawSearch}
        status={status}
        onStatusChange={setStatus}
        order={order}
        onOrderChange={setOrder}
      />

      <DataTable
        columns={formsColumns}
        data={forms}
        loading={loading}
        emptyLabel="No forms found"
        meta={tableMeta}
      />

      {totalPages > 1 && (
        <Pagination total={total} page={page} limit={LIMIT} onPageChange={onPageChange} />
      )}

      {selectedItem && (
        <DeleteFormDialog
          formId={selectedItem.id}
          onClose={hide}
          onDone={onDeleteCompleted}
          open={open}
        />
      )}
    </div>
  );
}
