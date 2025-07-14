import { Config, Data } from '@measured/puck';

import { InputProps } from "./_blocks/Input";
import { TextareaProps } from './_blocks/Textarea';
import { CheckboxProps } from './_blocks/Checkbox';
import { TextProps } from './_blocks/Text';
import { FlexProps } from './_blocks/Flex';
import { SelectProps } from './_blocks/Select';
import { RadioButtonProps } from './_blocks/RadioButton';
import { HeadingProps } from './_blocks/Heading';
import { SpaceProps } from './_blocks/Space';
import { FileProps } from './_blocks/FileInput';

import { RootProps } from './root';
export type { RootProps } from "./root";

export type Props = {
  Input: InputProps;
  Textarea: TextareaProps;
  Checkbox: CheckboxProps;
  Text: TextProps;
  Flex: FlexProps;
  Select: SelectProps;
  RadioButton: RadioButtonProps;
  Heading: HeadingProps;
  Space: SpaceProps;
  FileInput: FileProps;
};

export type UserConfig = Config<
  Props,
  RootProps,
  "layout" | "typography" | "inputs" | "interactive"
>;

export type UserData = Data<Props, RootProps>;