import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

import { RadioGroup as _RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RadioGroupProps = {
  label: string;
  items: { label: string; value: string }[];
  required: boolean;
  displayName?: string;
};

export const RadioGroupInner: ComponentConfig<RadioGroupProps> = {
  label: 'Radio Group',
  fields: {
    label: { type: 'text', label: 'Label' },
    items: {
      type: 'array',
      label: 'Items',
      arrayFields: {
        label: { type: 'text', label: 'Label' },
        value: { type: 'text', label: 'Value' },
      },
      defaultItemProps: { label: 'Label', value: 'value' },
      min: 2,
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
    label: 'Label',
    items: [],
    required: false,
    displayName: '',
  },
  render: ({ id, label, puck, items, required }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id];
    const error = errors?.[id];

    const selectedFields =
      document
        .querySelector('[data-selected-fields]')
        ?.getAttribute('data-selected-fields')
        ?.split(',') || [];
    const isSelected = puck.isEditing && selectedFields.includes(id);

    return (
      <Section className={`relative ${isSelected ? 'mt-10 border-[1px] border-blue-400' : ''}`}>
        {isSelected && (
          <span className="text-white bg-blue-400 absolute bottom-[100%] left-[-2px] px-2 py-1">
            AI
          </span>
        )}
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id} className={`${error ? 'text-destructive' : ''}`}>
            {label}
            {required ? <span className="text-destructive">*</span> : ''}
          </Label>
          <_RadioGroup
            defaultValue={defaultValue}
            aria-invalid={!!error}
            name={id}
            aria-describedby={error ? `${id}-error` : undefined}
            tabIndex={puck.isEditing ? -1 : undefined}
            id={id}
          >
            {items.map(({ label, value }, idx) => (
              <div key={`${value}_${idx}`} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${value}_${idx}`} />
                <Label htmlFor={`${value}_${idx}`}>{label}</Label>
              </div>
            ))}
          </_RadioGroup>
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

export const RadioGroup = withLayout(RadioGroupInner);
