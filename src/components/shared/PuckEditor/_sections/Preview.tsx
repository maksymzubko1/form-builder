import { ComponentData, createUsePuck } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';

const usePuck = createUsePuck<UserConfig>();

interface Props {
  children?: React.ReactNode;
}

const Preview = ({ children }: Props) => {
  const selectedFields =
    usePuck((s) => s.appState.data.root.props?.selectedItems as ComponentData[]) || [];

  return (
    <div
      data-selected-fields={selectedFields.map((item) => item.props.id).join(',')}
      className="h-full w-full"
    >
      {children}
    </div>
  );
};

export default Preview;
