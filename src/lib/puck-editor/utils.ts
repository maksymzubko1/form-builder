import { InteractiveItems } from '@/components/shared/PuckEditor/config';
import { getUniqueName } from '@/lib/submissions/utils';
import { ComponentData, Data } from '@measured/puck';

export type FieldDescriptor = {
  id: string;      // "Input-xxxx"
  label: string;   // Label
  type: string;    // Input, Select, Checkbox, FileInput
};

export function parseFieldsFromFormContent(content: Data, onlyInteractive = true): FieldDescriptor[] {
  const fields: FieldDescriptor[] = [];

  function walk(node: ComponentData) {
    if (!node) return;

    if (((InteractiveItems.includes(node.type) && onlyInteractive) || !onlyInteractive) && node.props?.id) {
      fields.push({
        id: node.props.id,
        label: getUniqueName(node.props.displayName as string || node.type as string, fields.map(field => field.label)),
        type: node.type,
      });
    }

    if (Array.isArray(node.props?.items)) {
      node.props.items.forEach(walk);
    }
    if (Array.isArray(node.props?.fields)) {
      node.props.fields.forEach(walk);
    }
  }

  if (Array.isArray(content?.content)) {
    content.content.forEach(walk);
  }

  return Array.from(new Map(fields.map(f => [f.id, f])).values());
}

export function updateItems(items: ComponentData[], patchMap: {
  [id: string]: { props: { [key: string]: unknown } }
}) {
  return items.map(item => {
    const patched = patchMap[item.props.id];
    let updated = item;
    if (patched) {
      updated = { ...item, props: { ...item.props, ...patched.props } };
    }
    if (item.props?.items) {
      updated = { ...updated, props: { ...item.props, items: updateItems(item.props?.items, patchMap) } };
    }
    return updated;
  });
}

// Универсальная функция удаления по id
export function deleteItems(items: ComponentData[], idSet: Set<string>) {
  return items
    .filter(item => !idSet.has(item.props.id))
    .map(item => {
      let updated = item;
      if (item.props?.items) {
        updated = {
          ...item,
          props: {
            ...item.props,
            items: deleteItems(item.props.items, idSet),
          },
        };
      }
      return updated;
    });
}


