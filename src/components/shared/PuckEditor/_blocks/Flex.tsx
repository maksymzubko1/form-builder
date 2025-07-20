import { withLayout, WithLayout } from '@/components/shared/PuckEditor/_sections/Layout';
import { ComponentConfig, Slot } from '@measured/puck';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';

export type FlexProps = WithLayout<{
  justifyContent: 'start' | 'center' | 'end';
  direction: 'row' | 'column';
  gap: number;
  wrap: 'wrap' | 'nowrap';
  items: Slot;
}>;

const FlexInternal: ComponentConfig<FlexProps> = {
  fields: {
    direction: {
      label: 'Direction',
      type: 'radio',
      options: [
        { label: 'Row', value: 'row' },
        { label: 'Column', value: 'column' },
      ],
    },
    justifyContent: {
      label: 'Justify Content',
      type: 'radio',
      options: [
        { label: 'Start', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'End', value: 'end' },
      ],
    },
    gap: {
      label: 'Gap',
      type: 'number',
      min: 0,
    },
    wrap: {
      label: 'Wrap',
      type: 'radio',
      options: [
        { label: 'true', value: 'wrap' },
        { label: 'false', value: 'nowrap' },
      ],
    },
    items: {
      type: 'slot',
    },
  },
  defaultProps: {
    justifyContent: 'start',
    direction: 'row',
    gap: 24,
    wrap: 'wrap',
    layout: {
      grow: true,
    },
    items: [],
  },
  render: ({ justifyContent, direction, gap, wrap, items: Items, id, puck }) => {
    const selectedFields =
      document
        .querySelector('[data-selected-fields]')
        ?.getAttribute('data-selected-fields')
        ?.split(',') || [];
    const isSelected = puck.isEditing && selectedFields.includes(id);

    return (
      <Section
        className={`relative ${isSelected ? 'mt-10 border-[1px] border-blue-400' : ''} h-full`}
      >
        {isSelected && (
          <span className="text-white bg-blue-400 absolute bottom-[100%] left-[-2px] px-2 py-1">
            AI
          </span>
        )}
        <Items
          style={{
            display: 'flex',
            justifyContent,
            flexDirection: direction,
            gap,
            flexWrap: wrap,
          }}
          disallow={['Hero', 'Stats']}
        />
      </Section>
    );
  },
};

export const Flex = withLayout(FlexInternal);
