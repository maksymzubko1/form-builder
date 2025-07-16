import { Label } from '@/components/ui/label';
import { Input as _Input } from '@/components/ui/input';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

export type InputProps = {
  placeholder: string;
  label: string;
  required: boolean;
  displayName?: string;
  validate?: string;
};

export const InputInner: ComponentConfig<InputProps> = {
  label: 'Input',
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
    validate: {
      type: 'select',
      label: 'Validate as',
      options: [
        { label: 'Not validate', value: 'off' },
        { label: 'Phone', value: 'phone' },
        { label: 'Email', value: 'email' },
      ],
    },
  },
  defaultProps: {
    placeholder: 'Placeholder',
    label: 'Label',
    required: false,
    displayName: '',
    validate: 'off',
  },
  render: ({ id, label, puck, placeholder, required, validate }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id];
    const error = errors?.[id];

    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id} className={`${error ? 'text-destructive' : ''}`}>
            {label}{required ? <span className="text-destructive">*</span> : ''}
          </Label>
          <_Input autoComplete={validate} tabIndex={puck.isEditing ? -1 : undefined} defaultValue={defaultValue}
                  name={id}
                  id={id} placeholder={placeholder} aria-invalid={!!error}
                  aria-describedby={error ? `${id}-error` : undefined} />
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

export const Input = withLayout(InputInner);