import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Checkbox as _Checkbox } from '@/components/ui/checkbox';

export type CheckboxProps = {
  label: string;
  description?: string;
};

export const Checkbox: ComponentConfig<CheckboxProps> = {
  label: 'Checkbox',
  fields: {
    description: {type: 'text', label: 'Description'},
    label: { type: 'text', label: 'Label' },
  },
  defaultProps: {
    label: 'Label',
    description: ''
  },
  render: ({ id, label, puck, description }) => {
    return (
      <div>
        <div className="flex items-start gap-3 mb-4">
          <_Checkbox tabIndex={puck.isEditing ? -1 : undefined} id={id} />
          <div className="grid gap-2">
            <Label htmlFor="terms-2">{label}</Label>
            {description && <p className="text-muted-foreground text-sm">
              {description}
            </p>}
          </div>
        </div>
      </div>
    );
  },
};