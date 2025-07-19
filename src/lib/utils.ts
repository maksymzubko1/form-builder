import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Value =
  | string
  | {
      key?: string;
      _isFile: boolean;
      name: string;
      size: number;
      type: string;
    };

export function formDataToJson(formData: FormData) {
  const obj: Record<string, Value> = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.name === '' && value.size === 0) {
        // skip empty files
        continue;
      }
      obj[key] = {
        _isFile: true,
        name: value.name,
        size: value.size,
        type: value.type,
        // content: await value.text(),
      };
    } else {
      obj[key] = value;
    }
  }

  return obj;
}
