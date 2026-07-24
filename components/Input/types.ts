import {
  StyleProp,
  TextInputProps,
  ViewStyle,
} from "react-native";

import { IconName } from "../Icon";

export interface AppInputProps
  extends Omit<TextInputProps, "style"> {

  label?: string;

  helperText?: string;

  error?: string;

  required?: boolean;

  password?: boolean;

  leftIcon?: IconName;

  rightIcon?: IconName;

  containerStyle?: StyleProp<ViewStyle>;
  optional?: boolean;
}