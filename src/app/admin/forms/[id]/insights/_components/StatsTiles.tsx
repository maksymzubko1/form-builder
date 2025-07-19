import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Loader from '@/components/ui/loader';

interface StatsTilesProps {
  total: number;
  week: number;
  today: number;
  viewsCount: number;
  conversion: number;
  loading: boolean;
}

export function StatsTiles({
  total,
  week,
  today,
  viewsCount,
  conversion,
  loading,
}: StatsTilesProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Submissions</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Loader className="place-content-start" size="l" /> : total}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>This Week</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Loader className="place-content-start" size="l" /> : week}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Today</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Loader className="place-content-start" size="l" /> : today}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Form views</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? <Loader className="place-content-start" size="l" /> : viewsCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              Conversion {viewsCount && !loading ? `${conversion}%` : '—'}
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    </div>
  );
}
