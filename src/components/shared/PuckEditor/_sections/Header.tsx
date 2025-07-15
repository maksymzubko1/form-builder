'use client';

import { createUsePuck, Data } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';
import { Button } from '@/components/ui/button';
import { Globe, PanelLeft, PanelRight } from 'lucide-react';
import Loader from '@/components/ui/loader';
import ActionButtons from '@/components/shared/PuckEditor/_sections/ActionButtons';

const usePuck = createUsePuck<UserConfig>();

type Props = {
  onPublish: (data: Data) => void,
  isEditing?: boolean,
  isLoading?: boolean;
  formProps?: {
    id: string;
    isPublished: boolean;
  }
}

export default function CustomHeader({ isLoading, onPublish, isEditing = false, formProps }: Props) {
  const get = usePuck((s) => s.get);
  const dispatch = usePuck((s) => s.dispatch);
  const previewMode = usePuck((s) => s.appState.ui.previewMode);
  const leftSideBarVisible = usePuck((s) => s.appState.ui.leftSideBarVisible);
  const rightSideBarVisible = usePuck((s) => s.appState.ui.rightSideBarVisible);

  const toggleMode = () => {
    dispatch({
      type: 'setUi',
      ui: {
        previewMode: previewMode === 'edit' ? 'interactive' : 'edit',
      },
    });
  };

  const toggleModeLeftSidebar = () => {
    dispatch({
      type: 'setUi',
      ui: {
        leftSideBarVisible: !leftSideBarVisible,
      },
    });
  };

  const toggleModeRightSidebar = () => {
    dispatch({
      type: 'setUi',
      ui: {
        rightSideBarVisible: !rightSideBarVisible,
      },
    });
  };

  const publish = () => {
    onPublish(get().appState.data);
  };

  return (
    <header
      className={`col-span-3 w-full flex flex-wrap gap-16 pb-[16px] pt-[16px] pr-[24px] pl-[24px] bg-white text-black items-center border-b-2 border-b-[#ddd]`}
      onClick={() => dispatch({ type: 'setUi', ui: { itemSelector: null } })}
    >
      <div className="flex gap-8 justify-between w-full">
        <div className="flex gap-2">
          <Button onClick={toggleModeLeftSidebar} title="Toggle left sidebar" aria-label="Toggle left sidebar"
                  variant={leftSideBarVisible ? 'secondary' : 'ghost'}>
            <PanelLeft className="size-6" size={16} />
          </Button>
          <Button onClick={toggleModeRightSidebar} title="Toggle right sidebar" aria-label="Toggle right sidebar"
                  variant={rightSideBarVisible ? 'secondary' : 'ghost'}>
            <PanelRight className="size-6" size={16} />
          </Button>
          <Button onClick={toggleMode} variant="secondary">
            Switch to {previewMode === 'edit' ? 'interactive' : 'edit'}
          </Button>
        </div>
        <div className="gap-4 flex flex-wrap items-center">
          <Button onClick={publish} disabled={isLoading}>
            {isLoading ?
              <Loader /> :
              <>
                <Globe size="14" /> {isEditing ? 'Save' : 'Publish'}
              </>
            }
          </Button>
          {isEditing && formProps && (
            <ActionButtons formProps={formProps} />
          )}
        </div>
      </div>
    </header>
  );
};