import { ComponentConfig } from '@measured/puck';
import { spacingOptions } from '@/components/shared/PuckEditor/options';

export type SpaceProps = {
  direction: 'both' | 'vertical' | 'horizontal';
  size: string;
};

const variants = {
  both: 'h-[var(--size)] w-[var(--size)]',
  horizontal: 'h-1 w-[var(--size)]',
  vertical: 'h-[var(--size)] w-full',
};

export const Space: ComponentConfig<SpaceProps> = {
  label: 'Space',
  fields: {
    size: {
      type: 'select',
      options: spacingOptions,
    },
    direction: {
      type: 'radio',
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'both', label: 'Both' },
      ],
    },
  },
  defaultProps: {
    direction: 'both',
    size: '24px',
  },
  inline: true,
  render: ({ size, direction, puck, id }) => {
    const selectedFields =
      document
        .querySelector('[data-selected-fields]')
        ?.getAttribute('data-selected-fields')
        ?.split(',') || [];
    const isSelected = puck.isEditing && selectedFields.includes(id);

    return (
      <div
        className={`relative ${isSelected ? 'mt-10 border-[1px] border-blue-400' : ''} ${variants[direction]}`}
        ref={puck.dragRef}
        style={{ '--size': size } as unknown}
      >
        {isSelected && (
          <span className="text-white bg-blue-400 absolute bottom-[100%] left-[-2px] px-2 py-1">
            AI
          </span>
        )}
      </div>
    );
  },
};
