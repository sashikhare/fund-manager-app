import { GestureResponderEvent } from "react-native";
import { IconName } from "../Icon";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type ButtonSize =
  | "small"
  | "medium"
  | "large";

export interface AppButtonProps {
  title: string;

  onPress?: (event: GestureResponderEvent) => void;

  variant?: ButtonVariant;

  size?: ButtonSize;

  loading?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  leftIcon?: IconName;

  rightIcon?: IconName;
}