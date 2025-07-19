export type TResponse<T> = {
  status: 'success' | 'error';
  error?: string;
  data?: T;
};
