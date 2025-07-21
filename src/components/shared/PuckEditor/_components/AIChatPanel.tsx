import React, { useState } from 'react';
import { askAi } from '@/lib/ai/askAi';
import { ArrowRight, Info, XIcon } from 'lucide-react';
import { GPTResponse, Message } from '@/types/puck';
import { ComponentData } from '@measured/puck';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function getFastCommands(selectedFields: ComponentData[]) {
  if (selectedFields.length === 1)
    return ['Suggest label for this field', 'Make this field required', 'Suggest validation rules'];
  if (selectedFields.length > 1)
    return ['Group selected fields', 'Suggest improvements for these fields'];
  return [
    'Suggest improvements for the form',
    'Add consent checkbox',
    'Generate placeholders for all fields',
  ];
}

const getGPTAnswer = (data: string): string | string[] => {
  try {
    const parsedData = JSON.parse(data) as GPTResponse;
    return parsedData?.map((content) => content?.message || '') || [];
  } catch (e: unknown) {
    console.log(e);
    return 'Failed to get message';
  }
};

interface Props {
  context: ComponentData[];
  open: boolean;
  onClose: () => void;
  onResponse: (patches: GPTResponse) => void;
  selectedFields: ComponentData[];
  formId?: string;
  initialMessages: Message[];
}

const MessageItem = ({
  message,
  role,
}: {
  role: 'user' | 'assistant';
  message: string | string[];
}) => {
  return (
    <div className={`flex items-start gap-2.5 ${role === 'user' ? 'flex-row-reverse' : ''}`}>
      <span className="rounded-[50%] border-[1px] border-gray-200 w-[30px] h-[30px] grid place-content-center shrink-0">
        {role === 'user' ? 'Y' : 'G'}
      </span>
      <div
        className={`flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-card ${role === 'user' ? 'rounded-s-xl rounded-b-xl' : 'rounded-e-xl rounded-es-xl'} dark:bg-card`}
      >
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {role === 'user' ? 'You' : 'GPT'}
          </span>
        </div>
        {Array.isArray(message) ? (
          message.map((msg, idx) => (
            <p key={idx} className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">
              {msg}
            </p>
          ))
        ) : (
          <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message}</p>
        )}
      </div>
    </div>
  );
};

export default function AIChatPanel({
  initialMessages,
  formId,
  context,
  onClose,
  onResponse,
  open,
  selectedFields,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    setLoading(true);
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    const res = await askAi(text, { context, selectedFields }, formId);
    const aiText = res.message || 'Sorry. Try again';

    try {
      const patch = JSON.parse(aiText) as GPTResponse;
      if (patch) onResponse?.(patch);
    } catch (e: unknown) {
      console.log(e);
    }
    setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
    setLoading(false);
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setInput(event.target.value);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter' && input.length > 1) {
      send(input);
    }
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[350px] h-full bg-white z-[99999] border-l shadow-lg flex flex-col ${open ? '' : 'hidden'}`}
    >
      <span onClick={onClose} className="absolute top-2 right-2 cursor-pointer">
        <XIcon />
      </span>
      <div className="border-b-[1px] border-gray-200">
        <span className="flex gap-2 pl-2 pr-10 py-3 text-xs items-center">
          <Info className="size-5" /> Only last 10 messages using for GPT context
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col">
        {messages.map((m, i) => (
          <MessageItem
            key={i}
            role={m.role}
            message={m.role === 'user' ? m.content : getGPTAnswer(m.content)}
          />
        ))}
        {loading && <div className="italic text-gray-400">Thinking...</div>}
      </div>
      <div className="p-2 border-t flex gap-2">
        <Input
          className="input flex-1 border-2 border-gray-200"
          placeholder="Write your request in English..."
          value={input}
          onChange={onChange}
          onKeyDown={onKeyDown}
          disabled={loading}
        />
        <Button
          className="btn btn-primary"
          onClick={() => send(input)}
          disabled={loading || input.length < 2}
        >
          <ArrowRight />
        </Button>
      </div>
      <div className="p-2 flex flex-wrap gap-2 border-t">
        {getFastCommands(selectedFields).map((cmd) => (
          <Button
            key={cmd}
            variant="secondary"
            className="btn btn-sm "
            onClick={() => send(cmd)}
            disabled={loading}
          >
            {cmd}
          </Button>
        ))}
      </div>
      <div className="p-2 text-xs text-gray-400 border-t-[1px] border-gray-400">
        Please write your requests in <b>English</b> for the best AI results.
      </div>
    </aside>
  );
}
