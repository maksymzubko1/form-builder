export type FormFieldDef = {
  id: string;
  type: string;
  required?: boolean;
  [key: string]: unknown;
};
