import { Label } from '@/components/ui/label';
import { ComponentConfig } from '@measured/puck';
import { Textarea as _Textarea } from '@/components/ui/textarea';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';
import { withLayout } from '@/components/shared/PuckEditor/_sections/Layout';

export type TextareaProps = {
  placeholder: string;
  label: string;
};

const TextareaInner: ComponentConfig<TextareaProps> = {
  label: 'Textarea',
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
          <_Textarea tabIndex={puck.isEditing ? -1 : undefined} id={id} placeholder={placeholder} rows={3} />
        </div>
      </Section>
    );
  },
};

export const Textarea = withLayout(TextareaInner);