import { useEffect, useState, useMemo } from 'react';
import { fetchSubmissionsStats, fetchFormContent } from '../_utils/api';
import { parseFieldsFromFormContent } from '../_utils/parseFieldsFromFormContent';
import { Submission, ChartPoint, TopAnswer, Fields } from '../types';
import { prepareSubmissions } from '@/lib/submission';

export function useInsightsData(formId: string, from?: string, to?: string) {
  const [data, setData] = useState<Submission[]>([]);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [fields, setFields] = useState<Fields[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    Promise.all([
      fetchSubmissionsStats(formId, from, to),
      fetchFormContent(formId),
    ]).then(([subs, formContent]) => {
      console.log(subs.data);
      setData(subs.data?.map(item => ({ ...item, data: prepareSubmissions(item.data) })) || []);
      setTotalViews(subs.totalViews);
      setFields(parseFieldsFromFormContent(formContent));
    }).finally(() => setLoading(false));
  }, [formId, from, to]);

  console.log(fields);
  const chartData: ChartPoint[] = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((s) => {
      const date = s.submittedAt.slice(0, 10);
      counts[date] = (counts[date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [data]);

  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const week = data.filter((s) => s.submittedAt >= weekAgo).length;
  const todayCount = data.filter((s) => s.submittedAt.slice(0, 10) === today).length;

  const conversion = totalViews
    ? Math.round((data.length / totalViews) * 100)
    : 0;

  const getTopAnswers = (key: string, type: string): TopAnswer[] => {
    const stats: Record<string, number> = {};
    data.forEach((s) => {
      if (type === 'FileInput') return;
      const v = s.data?.[key];
      if (Array.isArray(v)) {
        v.forEach(val => {
          if (val) stats[val] = (stats[val] || 0) + 1;
        });
      } else if (v) {
        stats[String(v)] = (stats[String(v)] || 0) + 1;
      }
    });
    return Object.entries(stats)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  return {
    loading,
    data,
    chartData,
    fields,
    week,
    today: todayCount,
    getTopAnswers,
    viewsCount: totalViews,
    conversion,
    total: data.length,
  };
}
