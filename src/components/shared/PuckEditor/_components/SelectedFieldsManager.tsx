'use client';

import React, { useEffect } from 'react';
import { ComponentData, createUsePuck } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';
import { parseFieldsFromFormContent } from '@/lib/puck-editor/utils';

const usePuck = createUsePuck<UserConfig>();

const SelectedFieldsManager = () => {
  const appState = usePuck((s) => s.appState);
  const dispatch = usePuck((s) => s.dispatch);

  // validate selected items
  useEffect(() => {
    const selectedFields = appState.data.root.props?.selectedItems as ComponentData[];
    if (!selectedFields) {
      dispatch({
        type: 'setData',
        data: (previous) => ({
          ...previous,
          root: { ...previous.root, props: { ...previous.root.props, selectedItems: [] } },
        }),
      });
    } else {
      // validate fields
      const fieldsFromFormContentMap = Object.fromEntries(
        parseFieldsFromFormContent(appState.data, false).map((item) => [item.id, item]),
      );

      const validated = selectedFields.filter((item) => item.props.id in fieldsFromFormContentMap);
      if (validated.length !== selectedFields.length) {
        dispatch({
          type: 'setData',
          data: (previous) => ({
            ...previous,
            root: { ...previous.root, props: { ...previous.root.props, selectedItems: validated } },
          }),
        });
      }
    }
    // eslint-disable-next-line
  }, [appState.data.root, appState.data.content]);

  return <></>;
};

export default SelectedFieldsManager;
