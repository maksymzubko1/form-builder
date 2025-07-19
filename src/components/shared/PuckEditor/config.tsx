import Root from './root';

import { Input } from './_blocks/Input';
import { Text } from './_blocks/Text';
import { Textarea } from './_blocks/Textarea';
import { Checkbox } from './_blocks/Checkbox';
import { Select } from './_blocks/Select';
import { Flex } from './_blocks/Flex';
import { RadioGroup } from './_blocks/RadioGroup';
import { Heading } from './_blocks/Heading';
import { Space } from './_blocks/Space';
import { File as FileInput } from './_blocks/FileInput';

import { UserConfig } from './types';

export const InteractiveItems = [
  'Textarea',
  'Input',
  'FileInput',
  'Select',
  'RadioGroup',
  'Checkbox',
];

export const puckConfig: UserConfig = {
  root: Root,
  categories: {
    layout: {
      title: 'Layout blocks',
      components: ['Flex', 'Space'],
    },
    typography: {
      title: 'Text blocks',
      components: ['Heading', 'Text'],
    },
    inputs: {
      title: 'Inputs',
      components: ['Textarea', 'Input', 'FileInput'],
    },
    interactive: {
      title: 'Interactive',
      components: ['Select', 'RadioGroup', 'Checkbox'],
    },
  },
  components: {
    Text,
    Textarea,
    Checkbox,
    Input,
    Flex,
    Select,
    RadioGroup,
    Heading,
    Space,
    FileInput,
  },
};
