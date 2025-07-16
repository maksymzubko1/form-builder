'use client';

import { useState } from 'react';
import { useInsightsData } from '../_hooks/useInsightsData';
import { DateRangeFilter } from './DateRangeFilter';
import { StatsTiles } from './StatsTiles';
import { InsightsChart } from './InsightsChart';
import { TopAnswers } from './TopAnswers';
import type { TopAnswer } from '../types';

export function InsightsLayout({ formId }: { formId: string }) {
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();

  const {
    loading,
    chartData,
    week,
    today,
    getTopAnswers,
    fields,
    total,
    viewsCount,
    conversion,
  } = useInsightsData(formId, from, to);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">Form Insights</h1>
      <DateRangeFilter from={from} to={to} setFrom={setFrom} setTo={setTo} />
      <StatsTiles loading={loading} total={total} week={week} today={today} viewsCount={viewsCount} conversion={conversion} />
      <InsightsChart data={chartData} loading={loading}  />

      {fields
        .map(field => {
          const answers: TopAnswer[] = getTopAnswers(field.id, field.type);
          if (!answers.length) return null;
          return <TopAnswers key={field.id} title={`Top answers for "${field.label} [${field.id}]"`}
                             answers={answers} />;
        })}
    </section>
  );
}
