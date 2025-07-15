import React from 'react';
import { ALargeSmall, AlignLeft } from 'lucide-react';
import { ComponentConfig } from '@measured/puck';
import { withLayout, WithLayout } from '@/components/shared/PuckEditor/_sections/Layout';
import { Section } from '@/components/shared/PuckEditor/_sections/Section';

export type TextProps = WithLayout<{
  align: 'left' | 'center' | 'right';
  text?: string;
  padding?: string;
  size?: 's' | 'm';
  color: 'default' | 'muted';
  maxWidth?: string;
}>;

const TextInner: ComponentConfig<TextProps> = {
  fields: {
    text: { type: 'textarea' },
    size: {
      type: 'select',
      labelIcon: <ALargeSmall size={16} />,
      options: [
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
      ],
    },
    align: {
      type: 'radio',
      labelIcon: <AlignLeft size={16} />,
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    color: {
      type: 'radio',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Muted', value: 'muted' },
      ],
    },
    maxWidth: { type: 'text' },
  },
  defaultProps: {
    align: 'left',
    text: 'Text',
    size: 'm',
    color: 'default',
  },
  render: ({ align, color, text, size, maxWidth, puck }) => {
    const isRender = puck.metadata.isRender;

    return (
      <Section maxWidth={maxWidth}>
        <span
          className=""
          style={{
            color:
              color === 'default' ? (isRender ? 'inherit' : 'black') : 'var(--puck-color-grey-05)',
            display: 'flex',
            textAlign: align,
            width: '100%',
            fontSize: size === 'm' ? '20px' : '16px',
            fontWeight: 400,
            maxWidth,
            justifyContent:
              align === 'center'
                ? 'center'
                : align === 'right'
                  ? 'flex-end'
                  : 'flex-start',
          }}
        >
          {text}
        </span>
      </Section>
    );
  },
};

export const Text = withLayout(TextInner);