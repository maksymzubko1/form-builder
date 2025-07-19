import { TopAnswer } from '@/app/admin/forms/[id]/insights/types';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

interface TopAnswersProps {
  title: string;
  answers: TopAnswer[];
}

export function TopAnswers({ title, answers }: TopAnswersProps) {
  if (!answers.length) return null;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1">
          {answers.map((ans, idx) => (
            <li key={ans.label} className="flex justify-between">
              <span>
                {idx + 1}. {ans.label}
              </span>
              <span className="font-bold">{ans.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
