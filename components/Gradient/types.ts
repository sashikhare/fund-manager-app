import { LinearGradientProps } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleProp, ViewStyle } from "react-native";

export interface GradientProps
  extends Omit<LinearGradientProps, "children"> {
  children?: ReactNode;

  style?: StyleProp<ViewStyle>;
}