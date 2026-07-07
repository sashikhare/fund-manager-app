import React from "react";
import { View } from "react-native";

import {
    Animation,
    Shadows,
    Spacing,
} from "../../theme";

import { Interactive } from "../Animated";

import { styles } from "./styles";
import { AppCardProps } from "./types";

export default function AppCard({
  children,
  variant = "filled",
  onPress,
  style,
  padding = Spacing.xxl,
  disabled = false,
}: AppCardProps) {
  const cardStyle = [
    styles.card,

    variant === "outlined" && {
      backgroundColor: "transparent",
      shadowOpacity: 0,
      elevation: 0,
    },

    variant === "elevated" && {
      ...Shadows.lg,
    },

    {
      padding,
    },

    style,
  ];

  if (onPress) {
    return (
      <Interactive
        onPress={onPress}
        disabled={disabled}
        pressedScale={Animation.scale.card}
        style={cardStyle}
      >
        {children}
      </Interactive>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}