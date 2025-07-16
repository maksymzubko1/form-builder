import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Textarea as _Textarea } from '@/components/ui/textarea';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

export type TextareaProps = {
  placeholder: string;
  label: string;
  required: boolean;
  displayName?: string;
};

const TextareaInner: ComponentConfig<TextareaProps> = {
  label: 'Textarea',
  fields: {
    placeholder: { type: 'text', label: 'Placeholder' },
    label: { type: 'text', label: 'Label' },
    required: {
      type: 'radio', label: 'Required', options: [
        { label: 'Not required', value: false },
        { label: 'Required', value: true },
      ],
    },
    displayName: { type: 'text', label: 'Display name' },
  },
  defaultProps: {
    placeholder: 'Placeholder',
    label: 'Label',
    required: false,
    displayName: ''
  },
  render: ({ id, label, puck, placeholder, required }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id];
    const error = errors?.[id];

    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id} className={`${error ? 'text-destructive' : ''}`}>
            {label}{required ? <span className="text-destructive">*</span> : ''}
          </Label>
          <_Textarea defaultValue={defaultValue} name={id} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
                     tabIndex={puck.isEditing ? -1 : undefined} id={id} placeholder={placeholder} rows={3} />
        </div>
        {error && (
          <div id={`${id}-error`} className="text-destructive text-sm mt-1" role="alert">
            {error.message as string}
          </div>
        )}
      </Section>
    );
  },
};

export const Textarea = withLayout(TextareaInner);