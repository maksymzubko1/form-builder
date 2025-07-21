import { Label } from '@/components/ui/label';
import { Input as _Input } from '@/components/ui/input';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';
import Link from 'next/link';

export type FileProps = {
  label: string;
  fileType: string;
  required: boolean;
  displayName?: string;
};

const ACCEPT_PRESETS: Record<string, string> = {
  all: '',
  images: 'image/*',
  videos: 'video/*',
  documents: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp',
};

export const FileInner: ComponentConfig<FileProps> = {
  label: 'File',
  fields: {
    label: { type: 'text', label: 'Label' },
    fileType: {
      type: 'select',
      label: 'Accept',
      options: [
        { label: 'All files', value: 'all' },
        { label: 'Only images', value: 'images' },
        { label: 'Only video', value: 'videos' },
        { label: 'Only documents', value: 'documents' },
      ],
    },
    required: {
      type: 'radio',
      label: 'Required',
      options: [
        { label: 'Not required', value: false },
        { label: 'Required', value: true },
      ],
    },
    displayName: { type: 'text', label: 'Display name' },
  },
  defaultProps: {
    label: 'Upload file',
    fileType: 'all',
    required: false,
    displayName: '',
  },
  render: ({ id, label, puck, fileType, required }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id];
    const error = errors?.[id];
    const accept = ACCEPT_PRESETS[fileType] || '';

    return (
      <Section>
        <div className="grid w-full items-center mb-4">
          <Label htmlFor={id} className={`${error ? 'text-destructive' : ''} mb-3`}>
            {label}
            {required ? <span className="text-destructive">*</span> : ''}
          </Label>
          <_Input
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            name={id}
            tabIndex={puck.isEditing ? -1 : undefined}
            accept={accept}
            id={id}
            type="file"
          />
          {defaultValue?.length && (
            <Link href={defaultValue} className="text-blue-500 mt-1 mb-2" target="_blank">
              Previous file
            </Link>
          )}
          {fileType !== 'all' && (
            <p className="text-xs text-muted-foreground mt-1">
              <b>Supported types:</b> {accept}
            </p>
          )}
          {error && (
            <div id={`${id}-error`} className="text-destructive text-sm mt-1" role="alert">
              {error.message as string}
            </div>
          )}
        </div>
      </Section>
    );
  },
};

export const File = withLayout(FileInner);
