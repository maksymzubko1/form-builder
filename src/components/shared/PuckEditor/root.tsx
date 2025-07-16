import { RootConfig } from '@measured/puck';

export type RootProps = {
  title: string;
  description: string;
  emailNotification: boolean;
};

export const Root: RootConfig<RootProps> = {
  fields: {
    title: { type: 'text', label: 'Title' },
    description: { type: 'textarea', label: 'Description' },
    emailNotification: {
      type: 'radio', label: 'Email notifications for new submissions', options: [
        { label: 'Disable', value: false },
        { label: 'Enable', value: true },
      ],
    },
  },
  defaultProps: { title: '', description: '', emailNotification: false },
  render: ({ puck: { renderDropZone: DropZone } }) => {
    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'white' }}
      >
        <DropZone zone="default-zone" style={{ flexGrow: 1 }} />
      </div>
    );
  },
};

export default Root;