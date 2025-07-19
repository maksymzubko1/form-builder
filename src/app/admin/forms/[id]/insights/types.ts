export type Submission = {
  id: string;
  email: string;
  submittedAt: string;
  data: Record<string, unknown>;
};

export type ChartPoint = {
  date: string;
  count: number;
};

export type TopAnswer = {
  label: string;
  count: number;
};

export type Fields = Record<string, unknown>;
