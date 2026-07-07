import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type CardVariant =
  | "filled"
  | "outlined"
  | "elevated";

export interface AppCardProps {
  children: ReactNode;

  variant?: CardVariant;

  onPress?: () => void;

  style?: StyleProp<ViewStyle>;

  padding?: number;

  disabled?: boolean;
}