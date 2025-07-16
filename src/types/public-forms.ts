import { emailSchema } from '@/app/form/[id]/types';
import { Data } from '@measured/puck';
import z from 'zod';

export type FormFieldDef = {
  id: string;
  type: string;
  required?: boolean;
  [key: string]: unknown;
};

export function extractFields(data: Data): FormFieldDef[] {
  if (!data || !Array.isArray(data.content)) return [];
  return data.content.map((item: unknown) => ({
    id: item.props.id,
    type: item.type,
    required: item.props?.required,
    ...item.props,
  }));
}

export const makeFormSchema = (fields: FormFieldDef[]) => {
  const shape: unknown = {
    email: emailSchema,
  };
  fields.forEach(f => {
    if (f.type === 'Input') {
      const base = z.string('Field is required');
      if (f.required) {
        shape[f.id] = base.min(1, 'Field is required');
      } else {
        shape[f.id] = base.optional();
      }
    } else if (f.type === 'Textarea') {
      const base = z.string('Field is required');
      if (f.required) {
        shape[f.id] = base.min(1, 'Field is required');
      } else {
        shape[f.id] = base.optional();
      }
    } else if (f.type === 'Textarea' || f.type === 'Checkbox' || f.type == 'Select' || f.type === 'RadioButton') {
      const base = z.string('Field is required');
      if (f.required) {
        shape[f.id] = base.min(1, 'Field is required');
      } else {
        shape[f.id] = base.optional();
      }
    } else if (f.type === 'FileInput') {
      const base = fileSchemaByAccept(f.fileType);
      if (f.required) {
        shape[f.id] = base.required();
      } else {
        shape[f.id] = base.optional();
      }
    }
  });
  return z.object(shape);
};

export const makeFormSchemaServer = (fields: FormFieldDef[]) => {
  const shape: unknown = {
    email: emailSchema,
  };
  fields.forEach(f => {
    if (f.type === 'Input') {
      if (f.required) {
        shape[f.id] = z.object({ value: z.string().min(1, "Field is required") });
      } else {
        shape[f.id] = z.object({ value: z.string().optional() });
      }
    } else if (f.type === 'Textarea' || f.type === 'Checkbox' || f.type == 'Select' || f.type === 'RadioButton') {
      if (f.required) {
        shape[f.id] = z.object({ value: z.string().min(1, "Field is required") });
      } else {
        shape[f.id] = z.object({ value: z.string().optional() });
      }
    } else if (f.type === 'FileInput') {
      const base = fileSchemaByAccept(f.fileType, true);
      if (f.required) {
        shape[f.id] = base.required();
      } else {
        shape[f.id] = base.optional();
      }
    }
  });
  return z.object(shape);
};


function fileSchemaByAccept(accept: string, forServer = false) {
  if (forServer) {
    return z.object({
      value: z.url('Invalid url'),
    });
  }

  const MAX_FILE_SIZE = 30_000_000;
  const ACCEPT_PRESETS: Record<string, string> = {
    all: '',
    images: 'image/*',
    videos: 'video/*',
    documents: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp',
  };
  const type = ACCEPT_PRESETS[accept];

  if (!type || type === '') {
    return z.object({
      name: z.string(),
      type: z.string(),
      size: z.number().max(MAX_FILE_SIZE),
    }, { error: 'Field is required' });
  }

  if (type.endsWith('/*')) {
    const prefix = type.replace('/*', '/');
    return z.object({
      name: z.string(),
      type: z.string().regex(new RegExp(`^${prefix}`), `Unsupported file type`),
      size: z.number().max(MAX_FILE_SIZE),
    }, { error: 'Field is required' });
  }

  if (type.startsWith('.')) {
    const allowed = type.split(',').map(x => x.trim());
    return z.object({
      name: z.string().refine(
        (val) => allowed.some(ext => val.endsWith(ext)),
        { message: `Unsupported file type` },
      ),
      type: z.string(),
      size: z.number().max(MAX_FILE_SIZE),
    }, { error: 'Field is required' });
  }

  return z.object({
    name: z.string(),
    type: z.string().regex(new RegExp(`^${type.replace('*', '.+')}$`), `Unsupported file type`),
    size: z.number().max(MAX_FILE_SIZE),
  }, { error: 'Field is required' });
}