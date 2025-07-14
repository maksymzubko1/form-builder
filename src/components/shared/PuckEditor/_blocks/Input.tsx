import { Label } from '@/components/ui/label';
import { Input as _Input } from '@/components/ui/input';
import { ComponentConfig } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

export type InputProps = {
  placeholder: string;
  label: string;
};

export const InputInner: ComponentConfig<InputProps> = {
  label: 'Input',
  fields: {
    placeholder: { type: 'text', label: 'Placeholder' },
    label: { type: 'text', label: 'Label' },
  },
  defaultProps: {
    placeholder: 'Placeholder',
    label: 'Label',
  },
  render: ({ id, label, puck, placeholder }) => {
    return (
      <Section>
        <div className="grid w-full items-center gap-3 mb-4">
          <Label htmlFor={id}>{label}</Label>
          <_Input tabIndex={puck.isEditing ? -1 : undefined} id={id} placeholder={placeholder} />
        </div>
      </Section>
    );
  },
};

export const Input = withLayout(InputInner)