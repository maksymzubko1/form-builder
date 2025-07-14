import { Label } from '@/components/ui/label';
import { Input as _Input } from '@/components/ui/input';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

export type FileProps = {
  label: string;
  fileType: string;
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
      type: 'select', label: 'Accept', options: [
        { label: 'All files', value: 'all' },
        { label: 'Only images', value: 'images' },
        { label: 'Only video', value: 'videos' },
        { label: 'Only documents', value: 'documents' },
      ],
    },
  },
  defaultProps: {
    label: 'Upload file',
    fileType: 'all',
  },
  render: ({ id, label, puck, fileType }) => {
    const accept = ACCEPT_PRESETS[fileType] || '';

    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id}>{label}</Label>
          <_Input tabIndex={puck.isEditing ? -1 : undefined} accept={accept} id={id} type="file" />
          {fileType !== 'all' && (
            <p className="text-xs text-muted-foreground mt-1">
              <b>Supported types:</b> {accept}
            </p>
          )}
        </div>
      </Section>
    );
  },
};

export const File = withLayout(FileInner);
