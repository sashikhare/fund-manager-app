import { Ionicons } from "@expo/vector-icons";
import React from "react";

import {
    Colors,
    IconSize,
} from "../../theme";

import { AppIconProps } from "./types";

function AppIcon({
  name,
  size = IconSize.md,
  color = Colors.text,
  style,
}: AppIconProps) {
  return (
    <Ionicons
      name={name}
      size={size}
      color={color}
      style={style}
    />
  );
}

export default React.memo(AppIcon);