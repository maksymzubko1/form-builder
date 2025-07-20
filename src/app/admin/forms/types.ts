export type FormListItem = {
  id: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TRequestFormParams = {
  status?: string;
  search?: string;
  order?: string;
  page: number;
  limit: number;
};

export type TResponseForms = {
  forms: {
    id: string;
    title: string;
    description: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
  }[];
  total: number;
};
