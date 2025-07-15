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
  required: boolean;
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
    required: {
      type: 'radio', label: 'Required', options: [
        { label: 'Not required', value: false },
        { label: 'Required', value: true },
      ],
    },
  },
  defaultProps: {
    placeholder: 'Placeholder',
    label: 'Label',
    items: [],
    required: false,
  },
  render: ({ id, label, puck, placeholder, items, required }) => {
    const { errors, defaultValues } = puck?.metadata;
    const defaultValue = defaultValues?.[id];
    const error = errors?.[id];

    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id} className={`${error ? 'text-destructive' : ''}`}>
            {label}{required ? <span className="text-destructive">*</span> : ''}
          </Label>
          <_Select defaultValue={defaultValue} name={id}>
            <SelectTrigger aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
                           tabIndex={puck.isEditing ? -1 : undefined} id={id} className="w-[180px]">
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

export const Select = withLayout(SelectInner);