import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Checkbox as _Checkbox } from '@/components/ui/checkbox';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';

export type CheckboxProps = {
  label: string;
  description?: string;
  required: boolean;
  displayName?: string;
};

export const CheckboxInner: ComponentConfig<CheckboxProps> = {
  label: 'Checkbox',
  fields: {
    description: { type: 'text', label: 'Description' },
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
    label: 'Label',
    description: '',
    required: false,
    displayName: '',
  },
  render: ({ id, label, puck, description, required }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id] === 'on';
    const error = errors?.[id];

    return (
      <Section>
        <div className="flex flex-col mb-4">
          <div className="flex items-start gap-3">
            <_Checkbox defaultChecked={defaultValue} name={id} aria-invalid={!!error}
                       aria-describedby={error ? `${id}-error` : undefined}
                       tabIndex={puck.isEditing ? -1 : undefined} id={id} />
            <div className="grid gap-2">
              <Label htmlFor={id} className={`${error ? 'text-destructive' : ''}`}>
                {label}{required ? <span className="text-destructive">*</span> : ''}
              </Label>
              {description && <p className="text-muted-foreground text-sm">
                {description}
              </p>}
            </div>
          </div>
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

export const Checkbox = withLayout(CheckboxInner);