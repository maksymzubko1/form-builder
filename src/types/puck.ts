export type GPTResponse = {
  action: 'update' | 'add' | 'delete',
  message?: string,
  result: { [key: string]: unknown, props: { id: string, [key: string]: unknown } }[]
}[]

export type Message = {
  role: 'user' | 'assistant';
  content: string;
}