// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ComponentData, Data } from '@measured/puck';
import { emailSchema } from '@/app/form/[id]/types';
import z from 'zod';
import { FormFieldDef } from '@/types/public-forms';

export function extractFields(data: Data): FormFieldDef[] {
  if (!data || !Array.isArray(data.content)) return [];
  return data.content.map((item: ComponentData) => ({
    type: item.type,
    required: item.props?.required,
    ...item.props,
  }));
}

export const makeFormSchema = (fields: FormFieldDef[]) => {
  const shape: z.ZodRawShape = {
    email: emailSchema,
  };
  fields.forEach((f) => {
    if (f.type === 'Input') {
      if (f.validate === 'email') {
        const base = z.email('Incorrect email');
        if (f.required) {
          shape['test'] = base.min(1, 'Field is required');
        } else {
          shape[f.id] = base.optional().nullable();
        }
      } else if (f.validate === 'phone') {
        const base = z.e164('Incorrect phone number');
        if (f.required) {
          shape[f.id] = base.min(1, 'Field is required');
        } else {
          shape[f.id] = base.optional().nullable();
        }
      } else {
        const base = z.string('Field is required');
        if (f.required) {
          shape[f.id] = base.min(1, 'Field is required');
        } else {
          shape[f.id] = base.optional().nullable();
        }
      }
    } else if (f.type === 'Textarea') {
      const base = z.string('Field is required');
      if (f.required) {
        shape[f.id] = base.min(1, 'Field is required');
      } else {
        shape[f.id] = base.optional().nullable();
      }
    } else if (
      f.type === 'Textarea' ||
      f.type === 'Checkbox' ||
      f.type == 'Select' ||
      f.type === 'RadioButton'
    ) {
      const base = z.string('Field is required');
      if (f.required) {
        shape[f.id] = base.min(1, 'Field is required');
      } else {
        shape[f.id] = base.optional().nullable();
      }
    } else if (f.type === 'FileInput') {
      const base = fileSchemaByAccept(f.fileType as string);
      if (f.required) {
        shape[f.id] = base.required();
      } else {
        shape[f.id] = base.optional().nullable();
      }
    }
  });
  return z.object(shape);
};

export const makeFormSchemaServer = (fields: FormFieldDef[]) => {
  const shape: z.ZodTypeAny = {
    email: emailSchema,
  };
  fields.forEach((f) => {
    if (f.type === 'Input') {
      if (f.validate === 'email') {
        if (f.required) {
          shape[f.id] = z.object({ value: z.email('Incorrect email').min(1, 'Field is required') });
        } else {
          shape[f.id] = z.object({ value: z.email('Incorrect email').optional().nullable() });
        }
      } else if (f.validate === 'phone') {
        if (f.required) {
          shape[f.id] = z.object({
            value: z.e164('Incorrect phone number').min(1, 'Field is required'),
          });
        } else {
          shape[f.id] = z.object({ value: z.e164('Incorrect phone number').optional().nullable() });
        }
      } else {
        if (f.required) {
          shape[f.id] = z.object({ value: z.string().min(1, 'Field is required') });
        } else {
          shape[f.id] = z.object({ value: z.string().optional().nullable() });
        }
      }
    } else if (
      f.type === 'Textarea' ||
      f.type === 'Checkbox' ||
      f.type == 'Select' ||
      f.type === 'RadioButton'
    ) {
      if (f.required) {
        shape[f.id] = z.object({ value: z.string().min(1, 'Field is required') });
      } else {
        shape[f.id] = z.object({ value: z.string().optional().nullable() });
      }
    } else if (f.type === 'FileInput') {
      const base = fileSchemaByAccept(f.fileType as string, true);
      if (f.required) {
        shape[f.id] = base.required();
      } else {
        shape[f.id] = base.optional().nullable();
      }
    }
  });
  return z.object(shape);
};

function fileSchemaByAccept(accept: string, forServer = false) {
  if (forServer) {
    return z.object({
      value: z.url('Invalid url').nullable(),
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
    return z.object(
      {
        name: z.string(),
        type: z.string(),
        size: z.number().max(MAX_FILE_SIZE),
      },
      { error: 'Field is required' },
    );
  }

  if (type.endsWith('/*')) {
    const prefix = type.replace('/*', '/');
    return z.object(
      {
        name: z.string(),
        type: z.string().regex(new RegExp(`^${prefix}`), `Unsupported file type`),
        size: z.number().max(MAX_FILE_SIZE),
      },
      { error: 'Field is required' },
    );
  }

  if (type.startsWith('.')) {
    const allowed = type.split(',').map((x) => x.trim());
    return z.object(
      {
        name: z.string().refine((val) => allowed.some((ext) => val.endsWith(ext)), {
          message: `Unsupported file type`,
        }),
        type: z.string(),
        size: z.number().max(MAX_FILE_SIZE),
      },
      { error: 'Field is required' },
    );
  }

  return z.object(
    {
      name: z.string(),
      type: z.string().regex(new RegExp(`^${type.replace('*', '.+')}$`), `Unsupported file type`),
      size: z.number().max(MAX_FILE_SIZE),
    },
    { error: 'Field is required' },
  );
}
