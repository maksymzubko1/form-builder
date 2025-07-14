import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';
import {
  Select as _Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SelectProps = {
  placeholder: string;
  label: string;
  items: { title: string; value: string }[];
};

export const SelectInner: ComponentConfig<SelectProps> = {
  label: 'Select',
  fields: {
    placeholder: { type: 'text', label: 'Placeholder' },
    label: { type: 'text', label: 'Label' },
    items: {
      type: 'array',
      label: 'Items',
      arrayFields: { title: { type: 'text', label: 'Title' }, value: { type: 'text', label: 'Value' } },
      defaultItemProps: { title: 'Title', value: 'value' },
      min: 2,
    },
  },
  defaultProps: {
    placeholder: 'Placeholder',
    label: 'Label',
    items: [],
  },
  render: ({ id, label, puck, placeholder, items }) => {
    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id}>{label}</Label>
          <_Select>
            <SelectTrigger tabIndex={puck.isEditing ? -1 : undefined} id={id} className="w-[180px]">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {items.map(({ title, value }, idx) => (
                  <SelectItem key={`${value}_${idx}`}
                              value={value}>{title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </_Select>
        </div>
      </Section>
    );
  },
};

export const Select = withLayout(SelectInner);