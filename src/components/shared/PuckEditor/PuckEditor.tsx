import dynamic from 'next/dynamic';
import { puckConfig } from './config';

const Puck = dynamic(() => import('@measured/puck').then((mod) => mod.Puck), { ssr: false });
import '@measured/puck/puck.css';
import CustomHeader from '@/components/shared/PuckEditor/_sections/Header';
import { Data } from '@measured/puck';
import ActionBarGroup from '@/components/shared/PuckEditor/_sections/ActionBarGroup';
import React from 'react';
import SelectedFieldsManager from '@/components/shared/PuckEditor/_components/SelectedFieldsManager';
import PuckAI from '@/components/shared/PuckEditor/_sections/PuckAI';
import Preview from '@/components/shared/PuckEditor/_sections/Preview';

type Props = {
  content: Data;
  onPublish: (data: Data) => void;
  isEditing?: boolean;
  isLoading?: boolean;
  formProps?: {
    id: string;
    isPublished: boolean;
  };
};

export default function PuckEditorForm({
  content,
  onPublish,
  isEditing = false,
  formProps,
  isLoading,
}: Props) {
  return (
    <div className="rounded-2xl overflow-hidden dark [&>div]:!overflow-x-hidden">
      <Puck
        config={puckConfig}
        data={content}
        overrides={{
          actionBar: ({ children, label }) => (
            <ActionBarGroup label={label}>{children}</ActionBarGroup>
          ),
          header: () => (
            <CustomHeader
              isLoading={isLoading}
              onPublish={onPublish}
              isEditing={isEditing}
              formProps={formProps}
            />
          ),
          puck: ({ children }) => {
            return (
              <div>
                {children}

                <SelectedFieldsManager />
                <PuckAI formId={formProps?.id} isEditing={isEditing} />
              </div>
            );
          },
          preview: ({ children }) => <Preview>{children}</Preview>,
        }}
        onPublish={onPublish}
      />
    </div>
  );
}
