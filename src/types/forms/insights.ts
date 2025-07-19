import { ComponentData } from '@measured/puck';

export type TInsightData = {
  total: number;
  totalViews: number;
  data: {
    email: string;
    formId: string;
    id: string;
    isDraft: boolean;
    submittedAt: string;
    data: Record<string, ComponentData>;
  }[];
};
