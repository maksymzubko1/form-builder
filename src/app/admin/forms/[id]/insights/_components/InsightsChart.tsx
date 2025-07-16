'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartPoint } from '@/app/admin/forms/[id]/insights/types';
import { ChartSkeleton } from '@/app/admin/forms/[id]/insights/_components/ChartSkeleton';

interface InsightsChartProps {
  data: ChartPoint[];
  loading: boolean;
}

export function InsightsChart({ data, loading }: InsightsChartProps) {
  if (loading) return <ChartSkeleton />;

  if (!data.length) return <div className="text-muted-foreground text-center py-8">No submissions yet</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
