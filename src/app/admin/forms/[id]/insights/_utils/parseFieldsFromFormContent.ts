import { InteractiveItems } from '@/components/shared/PuckEditor/config';

export type FieldDescriptor = {
  id: string;      // "Input-xxxx"
  label: string;   // Label
  type: string;    // Input, Select, Checkbox, FileInput
};

export function parseFieldsFromFormContent(content: unknown): FieldDescriptor[] {
  const fields: FieldDescriptor[] = [];

  function walk(node: unknown) {
    if (!node) return;

    if (InteractiveItems.includes(node.type) && node.props?.id) {
      fields.push({
        id: node.props.id,
        label: node.props.label || node.props.placeholder || node.props.id,
        type: node.type,
      });
    }

    if (Array.isArray(node.props?.items)) {
      node.props.items.forEach(walk);
    }
    if (Array.isArray(node.props?.fields)) {
      node.props.fields.forEach(walk);
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  }

  if (Array.isArray(content?.content)) {
    content.content.forEach(walk);
  }

  return Array.from(new Map(fields.map(f => [f.id, f])).values());
}
