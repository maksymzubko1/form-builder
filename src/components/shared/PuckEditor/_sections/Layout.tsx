import React, { CSSProperties, forwardRef, ReactNode } from 'react';
import { ComponentConfig, DefaultComponentProps, Fields, ObjectField } from '@measured/puck';
import { spacingOptions } from '@/components/shared/PuckEditor/options';

type LayoutFieldProps = {
  padding?: string;
  spanCol?: number;
  spanRow?: number;
  grow?: boolean;
};

export type WithLayout<Props extends DefaultComponentProps> = Props & {
  layout?: LayoutFieldProps;
};

type LayoutProps = WithLayout<{
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

export const layoutField: ObjectField<LayoutFieldProps> = {
  type: 'object',
  objectFields: {
    spanCol: {
      label: 'Grid Columns',
      type: 'number',
      min: 1,
      max: 12,
    },
    spanRow: {
      label: 'Grid Rows',
      type: 'number',
      min: 1,
      max: 12,
    },
    grow: {
      label: 'Flex Grow',
      type: 'radio',
      options: [
        { label: 'true', value: true },
        { label: 'false', value: false },
      ],
    },
    padding: {
      type: 'select',
      label: 'Vertical Padding',
      options: [{ label: '0px', value: '0px' }, ...spacingOptions],
    },
  },
};

const Layout = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, className, layout, style }, ref) => {
    return (
      <div
        className={className}
        style={{
          gridColumn: layout?.spanCol
            ? `span ${Math.max(Math.min(layout.spanCol, 12), 1)}`
            : undefined,
          gridRow: layout?.spanRow
            ? `span ${Math.max(Math.min(layout.spanRow, 12), 1)}`
            : undefined,
          paddingTop: layout?.padding,
          paddingBottom: layout?.padding,
          flex: layout?.grow ? '1 1 0' : undefined,
          ...style,
        }}
        ref={ref}
      >
        {children}
      </div>
    );
  },
);

Layout.displayName = 'Layout';

export { Layout };

export function withLayout<Props extends DefaultComponentProps = DefaultComponentProps>(
  componentConfig: ComponentConfig<Props>,
): ComponentConfig<Props & { layout?: LayoutFieldProps }> {
  return {
    ...componentConfig,
    fields: {
      ...componentConfig.fields,
      layout: layoutField,
    } as Fields<Props & { layout?: LayoutFieldProps }>,
    defaultProps: {
      ...componentConfig.defaultProps,
      layout: {
        spanCol: 1,
        spanRow: 1,
        padding: '0px',
        grow: false,
        ...componentConfig.defaultProps?.layout,
      },
    } as Props & { layout?: LayoutFieldProps },
    resolveFields: (_, params) => {
      if (params.parent?.type === 'Grid') {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              spanCol: layoutField.objectFields.spanCol,
              spanRow: layoutField.objectFields.spanRow,
              padding: layoutField.objectFields.padding,
            },
          },
        } as Fields<Props & { layout?: LayoutFieldProps }>;
      }
      if (params.parent?.type === 'Flex') {
        return {
          ...componentConfig.fields,
          layout: {
            ...layoutField,
            objectFields: {
              grow: layoutField.objectFields.grow,
              padding: layoutField.objectFields.padding,
            },
          },
        } as Fields<Props & { layout?: LayoutFieldProps }>;
      }

      return {
        ...componentConfig.fields,
        layout: {
          ...layoutField,
          objectFields: {
            padding: layoutField.objectFields.padding,
          },
        },
      } as Fields<Props & { layout?: LayoutFieldProps }>;
    },
    inline: true,
    render: (props) => {
      const selectedFields =
        document
          .querySelector('[data-selected-fields]')
          ?.getAttribute('data-selected-fields')
          ?.split(',') || [];
      const isSelected = props.puck.isEditing && selectedFields.includes(props.id);

      return (
        <Layout
          layout={props.layout as LayoutFieldProps}
          ref={props.puck.dragRef}
          className={`relative ${isSelected ? 'mt-10 border-[1px] border-green-600' : ''}`}
        >
          {isSelected && (
            <span className="text-white font-sans bg-green-600 absolute bottom-[100%] left-[-2px] px-3 py-1">
              AI
            </span>
          )}
          {componentConfig.render(props)}
        </Layout>
      );
    },
  };
}
