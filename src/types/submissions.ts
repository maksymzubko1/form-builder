export type SubmissionData = Record<string, unknown>;
export interface Submission {
  id: string;
  email: string;
  data: SubmissionData;
  submittedAt: string;
}
