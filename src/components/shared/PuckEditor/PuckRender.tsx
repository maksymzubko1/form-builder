import '@measured/puck/puck.css';
import { Data } from '@measured/puck';
import dynamic from 'next/dynamic';
import { puckConfig } from './config';
import { FieldErrors } from 'react-hook-form';

const Render = dynamic(() => import('@measured/puck').then((mod) => mod.Render), { ssr: false });

type Props = {
  content: Data;
  errors?: FieldErrors<Record<string, unknown>>;
  defaultValues?: Record<string, unknown>;
};

export default function PuckRender({ content, errors, defaultValues }: Props) {
  return (
    <Render
      config={{ components: puckConfig.components }}
      data={content}
      metadata={{ errors: errors, defaultValues, isRender: true }}
    />
  );
}
