import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { puckConfig } from './config';

const Puck = dynamic(() =>
  import('@measured/puck').then(mod => mod.Puck), { ssr: false });
import '@measured/puck/puck.css';

type Props = {
  content: never, setContent: (data: unknown) => void;
  onPublish?: (data: unknown) => void;
}

export default function PuckEditorForm({ content, setContent, onPublish }: Props) {
  return (
    <div className='rounded-2xl overflow-hidden'>
    <Puck
      config={puckConfig}
      data={content}
      onChange={setContent}
      onPublish={onPublish}
      overrides={{iframe: ({ children, document }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (document) {
              document.body.setAttribute("class", "");
            }
          }, [document]);

          return <>{children}</>;
        },}}
    />
    </div>
  );
}