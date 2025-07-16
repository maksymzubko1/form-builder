import { TopAnswer } from '@/app/admin/forms/[id]/insights/types';

interface TopAnswersProps {
  title: string;
  answers: TopAnswer[];
}

export function TopAnswers({ title, answers }: TopAnswersProps) {
  if (!answers.length) return null;

  return (
    <div className="bg-card rounded-xl p-4 mb-4 shadow">
      <div className="font-medium mb-2">{title}</div>
      <ul className="space-y-1">
        {answers.map(ans => (
          <li key={ans.label} className="flex justify-between">
            <span>{ans.label}</span>
            <span className="font-bold">{ans.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
