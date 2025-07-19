import React, { useEffect, useState } from 'react';
import { useModal } from '@/lib/hooks/useModal';
import { ComponentData, createUsePuck } from '@measured/puck';
import { UserConfig } from '@/components/shared/PuckEditor/types';
import { GPTResponse, Message } from '@/types/puck';
import AIChatPanel from '@/components/shared/PuckEditor/_components/AIChatPanel';
import { deleteItems, updateItems } from '@/lib/puck-editor/utils';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { API_ROUTES } from '@/constants/routes';

const usePuck = createUsePuck<UserConfig>();

interface Props {
  formId?: string;
}

const PuckAI = ({ formId }: Props) => {
  const context = usePuck((s) => s.appState.data.content);
  const dispatch = usePuck((s) => s.dispatch);
  const selectedFields = usePuck((s) => s.appState.data.root.props?.selectedItems as ComponentData[]) || [];
  const [loadInitialMessages, setLoadInitialMessages] = useState<boolean>(true);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const { open, toggle } = useModal();

  const onResponse = (patches: GPTResponse) => {
    let data = context;

    for (const patch of patches) {
      if (patch.action === 'update') {
        const patchMap = Object.fromEntries(
          patch.result.map(p => [p.props.id, p]),
        );
        const updated = updateItems(data, patchMap);
        data = updated;
      } else if (patch.action === 'add') {
        data = [...data, ...patch.result];
      } else if (patch.action === 'delete') {
        const idSet = new Set(patch.result.map(p => p.props.id));
        data = deleteItems(data, idSet);
      }
    }

    dispatch({
      type: 'setData',
      data: (previous) => {
        return { ...previous, content: data };
      },
    });
  };

  useEffect(() => {
    const getInitialMessages = async () => {
      setLoadInitialMessages(true);
      try {
        const res = await fetch(`${API_ROUTES.AI}?formId=${formId}`);
        if (res.ok) {
          const data = await res.json();
          setInitialMessages(data?.messages || []);
        } else {
          console.log('Failed to get intitial messages');
        }
      } catch (e) {
        console.log('Failed to get intitial messages', e.message);
      } finally {
        setLoadInitialMessages(false);
      }
    };

    if (formId) {
      getInitialMessages();
    }
  }, [formId]);

  return (
    <div>
      <Button
        className="btn fixed bottom-0 right-0 rounded-[50%] bg-card p-5 z-[99999] w-[50px] h-[50px] grid place-content-center"
        onClick={toggle} variant="secondary">
        <Bot color={'white'} className="size-6" />
      </Button>
      {!loadInitialMessages &&
        <AIChatPanel
          formId={formId}
          initialMessages={initialMessages}
          context={context}
          open={open}
          onClose={toggle}
          onResponse={onResponse}
          selectedFields={selectedFields} />}
    </div>
  );
};

export default PuckAI;