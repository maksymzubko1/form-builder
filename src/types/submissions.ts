export type SubmissionData = Record<
  string,
  {
    id: string;
    type: string;
    value: string | null;
    displayName?: string;
  }
>;
export interface Submission {
  id: string;
  email: string;
  data: SubmissionData | Record<string, string | null>;
  submittedAt: string;
}
