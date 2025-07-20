'use client';

import { createUsePuck, Data } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';
import { Button } from '@/components/ui/button';
import { Globe, PanelLeft, PanelRight, Redo, Undo } from 'lucide-react';
import Loader from '@/components/ui/loader';
import ActionButtons from '@/components/shared/PuckEditor/_sections/ActionButtons';

const usePuck = createUsePuck<UserConfig>();

type Props = {
  onPublish: (data: Data) => void;
  isEditing?: boolean;
  isLoading?: boolean;
  formProps?: {
    id: string;
    isPublished: boolean;
  };
};

export default function CustomHeader({
  isLoading,
  onPublish,
  isEditing = false,
  formProps,
}: Props) {
  const appState = usePuck((s) => s.appState);
  const dispatch = usePuck((s) => s.dispatch);
  const { previewMode, leftSideBarVisible, rightSideBarVisible } = usePuck((s) => s.appState.ui);
  const history = usePuck((s) => s.history);

  const toggleMode = () => {
    dispatch({
      type: 'setUi',
      ui: {
        previewMode: previewMode === 'edit' ? 'interactive' : 'edit',
      },
    });
  };

  const undo = () => {
    history.back();
  };

  const redo = () => {
    history.forward();
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
    onPublish(appState.data);
  };

  return (
    <>
      <header
        className={`col-span-3 w-full flex flex-wrap gap-16 pb-[16px] pt-[16px] pr-[24px] pl-[24px] dark bg-muted items-center border-b-2 border-b-[#ddd]`}
        onClick={() => dispatch({ type: 'setUi', ui: { itemSelector: null } })}
      >
        <div className="flex gap-8 justify-between w-full">
          <div className="flex items-center">
            <Button
              onClick={toggleModeLeftSidebar}
              title="Toggle left sidebar"
              aria-label="Toggle left sidebar"
              variant={leftSideBarVisible ? 'secondary' : 'ghost'}
            >
              <PanelLeft className="size-6" size={16} />
            </Button>
            <Button
              onClick={toggleModeRightSidebar}
              title="Toggle right sidebar"
              aria-label="Toggle right sidebar"
              variant={rightSideBarVisible ? 'secondary' : 'ghost'}
            >
              <PanelRight className="size-6" size={16} />
            </Button>
            <Button onClick={toggleMode} className="ml-2">
              Switch to {previewMode === 'edit' ? 'preview' : 'edit'}
            </Button>
          </div>
          <div className="gap-4 flex flex-wrap items-center">
            <Button onClick={undo} title="Undo" disabled={!history.hasPast} aria-label="Undo">
              <Undo className="size-6" size={16} />
            </Button>
            <Button onClick={redo} title="Redo" aria-label="Redo" disabled={!history.hasFuture}>
              <Redo className="size-6" size={16} />
            </Button>
            <Button onClick={publish} disabled={isLoading}>
              {isLoading ? (
                <Loader />
              ) : (
                <>
                  <Globe size="14" /> {isEditing ? 'Save' : 'Publish'}
                </>
              )}
            </Button>
            {isEditing && formProps && <ActionButtons formProps={formProps} />}
          </div>
        </div>
      </header>
    </>
  );
}
