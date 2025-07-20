'use client';

import { useEffect, useState, useMemo } from 'react';
import type { SubmissionsFilter } from '../types';
import { submissionsColumns } from './columns';
import { SubmissionsFilterForm } from './SubmissionsFilterForm';
import { ExportButton } from './ExportButton';
import { SubmissionDetailsModal } from './SubmissionDetailsModal';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Submission } from '@/types/submissions';
import { Pagination } from '@/components/shared/Pagination';
import DeleteModal, { DeleteTarget } from './DeleteModal';
import { useModal } from '@/lib/hooks/useModal';
import { toast } from 'sonner';
import { useSidebar } from '@/components/ui/sidebar';
import {
  requestSubmissionsByParams,
  requestSubmissionsDelete,
} from '@/app/admin/forms/[id]/submissions/utils';

interface SubmissionsTableProps {
  formId: string;
}

const DEFAULT_PER_PAGE = 10;

export const SubmissionsTable: React.FC<SubmissionsTableProps> = ({ formId }) => {
  const { setPageTitle } = useSidebar();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<SubmissionsFilter>({});
  const [selected, setSelected] = useState<Submission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
  const { hide, open, toggle } = useModal(false);

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(DEFAULT_PER_PAGE);
  const [total, setTotal] = useState<number>(0);

  const loadSubmissions = async (
    filterValue: SubmissionsFilter = filter,
    pageValue: number = page,
    perPageValue: number = perPage,
  ): Promise<void> => {
    setLoading(true);
    try {
      const res = await requestSubmissionsByParams(formId, {
        ...filterValue,
        page: pageValue.toString(),
        perPage: perPageValue.toString(),
      });

      if (res.status === 'success') {
        setSubmissions(res.data?.data ?? []);
        setTotal(res.data?.total ?? 0);
      } else {
        toast.error(res.error);
      }
    } catch (e: unknown) {
      console.log(e);
      toast.error('Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageTitle('Form submissions');
  }, [setPageTitle]);

  useEffect(() => {
    loadSubmissions(filter, page, perPage);
    // eslint-disable-next-line
  }, [filter, page, perPage]);

  // eslint-disable-next-line
  const handleDelete = (id: string): void => {
    toggle();
    setDeleteTarget({ type: 'one', id });
  };
  const handleClearAll = (): void => {
    toggle();
    setDeleteTarget({ type: 'all' });
  };
  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const confirmDelete = async (): Promise<void> => {
    if (!deleteTarget) return;
    toast.info('Deleting in progress...');
    if (deleteTarget.type === 'one') {
      try {
        const res = await requestSubmissionsDelete(formId, deleteTarget.id);

        if (res.status === 'success') {
          toast.success('Submission deleted successfully.');
        } else {
          toast.error('Error deleting submission.');
        }
      } catch (e: unknown) {
        console.log(e);
        toast.error('Error deleting submission.');
      }
    } else if (deleteTarget.type === 'all') {
      try {
        const res = await requestSubmissionsDelete(formId);

        if (res.status === 'success') {
          toast.success('Submissions deleted successfully.');
        } else {
          toast.error('Error deleting submissions.');
        }
      } catch (e: unknown) {
        console.log(e);
        toast.error('Error deleting submissions.');
      }
    }
    setDeleteTarget(null);
    setPage(1);
    loadSubmissions(filter, 1, perPage);
  };

  const tableMeta = useMemo(
    () => ({
      setSelected,
      handleDelete,
    }),
    [setSelected, handleDelete],
  );

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <div className="flex items-end gap-4 mb-4">
        <SubmissionsFilterForm
          onChange={(f) => {
            setPage(1);
            setFilter(f);
          }}
        />
        <ExportButton formId={formId} />
        <Button variant="destructive" className="ml-auto" onClick={handleClearAll}>
          Clear All
        </Button>
      </div>
      <DataTable
        columns={submissionsColumns}
        data={submissions}
        loading={loading}
        emptyLabel="No submissions"
        meta={tableMeta}
      />
      {totalPages > 1 && (
        <Pagination total={total} page={page} limit={perPage} onPageChange={handleChangePage} />
      )}
      {selected && (
        <SubmissionDetailsModal submission={selected} onClose={() => setSelected(null)} />
      )}
      <DeleteModal
        open={open}
        onClose={hide}
        deleteTarget={deleteTarget}
        onDelete={confirmDelete}
      />
    </div>
  );
};
