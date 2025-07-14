import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export type RadioButtonProps = {
  label: string;
  items: { label: string; value: string; }[];
};

export const RadioButtonInner: ComponentConfig<RadioButtonProps> = {
  label: 'Radio Group',
  fields: {
    label: { type: 'text', label: 'Label' },
    items: {
      type: 'array',
      label: 'Items',
      arrayFields: { label: { type: 'text', label: 'Label' }, value: { type: 'text', label: 'Value' } },
      defaultItemProps: { label: 'Label', value: 'value' },
      min: 2,
    },
  },
  defaultProps: {
    label: 'Label',
    items: [],
  },
  render: ({ id, label, puck, items }) => {
    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id}>{label}</Label>
          <RadioGroup tabIndex={puck.isEditing ? -1 : undefined} id={id}>
            {items.map(({ label, value }, idx) => (
              <div key={`${value}_${idx}`} className="flex items-center space-x-2">
                <RadioGroupItem value={value} id={`${value}_${idx}`} />
                <Label htmlFor={`${value}_${idx}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Section>
    );
  },
};

export const RadioButton = withLayout(RadioButtonInner);