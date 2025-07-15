import dynamic from 'next/dynamic';
import { puckConfig } from './config';

const Puck = dynamic(() =>
  import('@measured/puck').then(mod => mod.Puck), { ssr: false });
import '@measured/puck/puck.css';
import CustomHeader from '@/components/shared/PuckEditor/_sections/Header';
import { Data } from '@measured/puck';

type Props = {
  content: Data;
  onPublish: (data: Data) => void;
  isEditing?: boolean;
  isLoading?: boolean;
  formProps?: {
    id: string;
    isPublished: boolean;
  }
}

export default function PuckEditorForm({ content, onPublish, isEditing = false, formProps, isLoading }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden">
      <Puck
        config={puckConfig}
        data={content}
        renderHeader={() => {
          return <CustomHeader isLoading={isLoading} onPublish={onPublish} isEditing={isEditing}
                               formProps={formProps} />;
        }}
        onPublish={onPublish}
      />
    </div>
  );
}