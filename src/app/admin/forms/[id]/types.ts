import { Data } from '@measured/puck';

export type TResponseUpdateForm = {
  form: {
    id: string;
    title: string;
    description: string;
    isPublished: boolean;
    updatedAt: string;
    content: Data;
  };
};
