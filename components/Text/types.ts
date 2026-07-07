import { StyleProp, TextStyle } from "react-native";
import { Typography } from "../../theme";

export type TextVariant = keyof typeof Typography;

export type FontWeight =
  | "400"
  | "500"
  | "600"
  | "700";

export interface AppTextProps {
  children: React.ReactNode;

  variant?: TextVariant;

  color?: string;

  align?: "auto" | "left" | "center" | "right" | "justify";

  weight?: FontWeight;

  numberOfLines?: number;

  style?: StyleProp<TextStyle>;
}