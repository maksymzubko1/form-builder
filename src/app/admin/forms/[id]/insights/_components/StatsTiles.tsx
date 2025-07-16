import Loader from '@/components/ui/loader';

interface StatsTilesProps {
  total: number;
  week: number;
  today: number;
  viewsCount: number;
  conversion: number;
  loading: boolean;
}

export function StatsTiles({ total, week, today, viewsCount, conversion, loading }: StatsTilesProps) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <div className="bg-card p-4 rounded-xl shadow flex flex-col items-center">
        <div className="text-2xl font-bold">{loading ? <Loader size="m" /> : total}</div>
        <div className="text-muted-foreground text-sm">Total submissions</div>
      </div>
      <div className="bg-card p-4 rounded-xl shadow flex flex-col items-center">
        <div className="text-2xl font-bold">{loading ? <Loader size="m" /> : week}</div>
        <div className="text-muted-foreground text-sm">This week</div>
      </div>
      <div className="bg-card p-4 rounded-xl shadow flex flex-col items-center">
        <div className="text-2xl font-bold">{loading ? <Loader size="m" /> : today}</div>
        <div className="text-muted-foreground text-sm">Today</div>
      </div>
      <div className="bg-card p-4 rounded-xl shadow flex flex-col items-center">
        <div className="text-2xl font-bold">{loading ? <Loader size="m" /> : viewsCount}</div>
        <div className="text-muted-foreground text-sm">Form views</div>
        <div className="text-primary text-lg font-bold mt-1">
          {(viewsCount && !loading) ? `${conversion}%` : '—'} <span
          className="text-xs text-muted-foreground ml-1">conversion</span>
        </div>
      </div>
    </div>
  );
}
