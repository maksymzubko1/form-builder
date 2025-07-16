'use client';

import * as React from 'react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { ChartPoint } from '@/app/admin/forms/[id]/insights/types';
import { ChartSkeleton } from '@/app/admin/forms/[id]/insights/_components/ChartSkeleton';

interface InsightsChartProps {
  data: ChartPoint[];
  loading: boolean;
  dateRange: {
    from?: string;
    to?: string;
  }
}

const chartConfig = {
  submissions: {
    label: 'Submissions',
  },
  count: {
    label: 'Submissions',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function InsightsChart({ data, loading, dateRange }: InsightsChartProps) {
  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b px-0 !py-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-6">
          <CardTitle>Total Submissions</CardTitle>
          <CardDescription>
            {
              dateRange.from ? new Date(dateRange.from).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }) : 'Any'} - {
              dateRange.to ? new Date(dateRange.to).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              }) : 'Any'
            }
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {loading ? <ChartSkeleton /> :
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="submissions"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey="count"
                type="monotone"
                stroke={`var(--color-count)`}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
