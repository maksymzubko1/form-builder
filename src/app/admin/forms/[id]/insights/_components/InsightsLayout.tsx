'use client';

import { useEffect, useState } from 'react';
import { useInsightsData } from '../_hooks/useInsightsData';
import { DateRangeFilter } from './DateRangeFilter';
import { StatsTiles } from './StatsTiles';
import { InsightsChart } from './InsightsChart';
import { TopAnswers } from './TopAnswers';
import type { TopAnswer } from '../types';
import { useSidebar } from '@/components/ui/sidebar';

export function InsightsLayout({ formId }: { formId: string }) {
  const { setPageTitle } = useSidebar();
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();

  const { loading, chartData, week, today, getTopAnswers, fields, total, viewsCount, conversion } =
    useInsightsData(formId, from, to);

  useEffect(() => {
    setPageTitle('Form Insights');
  }, [setPageTitle]);

  return (
    <section className="flex flex-col gap-4">
      <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
      <StatsTiles
        loading={loading}
        total={total}
        week={week}
        today={today}
        viewsCount={viewsCount}
        conversion={conversion}
      />
      <InsightsChart
        data={chartData}
        loading={loading}
        dateRange={{ from: from as string, to: to as string }}
      />

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 lg:grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {fields.map((field) => {
          const answers: TopAnswer[] = getTopAnswers(field.label as string, field.type as string);
          if (!answers.length) return null;
          return (
            <TopAnswers
              key={field.id as string}
              title={`Top answers for "${field.label}"`}
              answers={answers}
            />
          );
        })}
      </div>
    </section>
  );
}
