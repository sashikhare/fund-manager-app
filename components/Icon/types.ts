import { Ionicons } from "@expo/vector-icons";
import { StyleProp, TextStyle } from "react-native";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface AppIconProps {
  name: IconName;

  size?: number;

  color?: string;
  style?: StyleProp<TextStyle>;
}
