import React from 'react';
import { ActionBar, ComponentData, createUsePuck } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';

interface Props {
  label?: string;
  children?: React.ReactNode;
}

const usePuck = createUsePuck<UserConfig>();

const ActionBarGroup = ({ label, children }: Props) => {
  const selectedItem = usePuck((s) => s.selectedItem);
  const data = usePuck((s) => s.appState.data.root);
  const isItemSelected =
    selectedItem &&
    (data.props?.selectedItems as ComponentData[])?.find(
      (s) => s.props.id === selectedItem.props.id,
    );
  const dispatch = usePuck((s) => s.dispatch);

  const handleClick = () => {
    dispatch({
      type: 'setData',
      data: (previous) => {
        const prevSelectedItems = (previous.root.props?.selectedItems as ComponentData[]) || [];
        const selectedItems = isItemSelected
          ? [...prevSelectedItems.filter((item) => item.props.id !== selectedItem.props.id)]
          : [...prevSelectedItems, selectedItem];

        return {
          ...previous,
          root: { ...previous.root, props: { ...previous.root.props, selectedItems } },
        };
      },
    });
  };

  return (
    <ActionBar label={label}>
      <ActionBar.Group>{children}</ActionBar.Group>
      <ActionBar.Action onClick={handleClick}>
        <span className={isItemSelected ? 'text-blue-500' : ''}>AI</span>
      </ActionBar.Action>
    </ActionBar>
  );
};

export default ActionBarGroup;

// import React from 'react';
// import { ActionBar, createUsePuck } from '@measured/puck';
// import { UserConfig } from '@/components/shared/PuckEditor/types';
// import { InteractiveItems } from '@/components/shared/PuckEditor/config';
//
// interface Props {
//   label?: string;
//   children?: React.ReactNode;
//   onSelect: (item: unknown, type: 'add' | 'remove') => void;
//   selectedItems: unknown[];
// }
//
// const usePuck = createUsePuck<UserConfig>();
//
// const ActionBarGroup = ({ label, children, onSelect, selectedItems }: Props) => {
//   const selectedItem = usePuck((s) => s.selectedItem);
//   const isItemSelected = selectedItem && selectedItems?.find((s) => s.props.id === selectedItem.props.id);
//
//   const handleClick = () => {
//     onSelect(selectedItem, isItemSelected ? 'remove' : 'add');
//   };
//
//   return (
//     <ActionBar label={label}>
//       <ActionBar.Group>{children}</ActionBar.Group>
//       {label && InteractiveItems.includes(label) && <ActionBar.Action onClick={handleClick}>
//         <span >
//           AI
//         </span>
//       </ActionBar.Action>}
//     </ActionBar>
//   );
// };
//
// export default ActionBarGroup;
