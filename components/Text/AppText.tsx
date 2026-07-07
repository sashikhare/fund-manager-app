import React from "react";
import { Text as RNText } from "react-native";

import { Colors, Typography } from "../../theme";

import { AppTextProps } from "./types";

function AppText({
  children,
  variant = "body",
  color = Colors.text,
  align = "left",
  numberOfLines,
  style,
  weight,
}: AppTextProps) {
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[
        Typography[variant],
        {
          color,
          textAlign: align,
          ...(weight && { fontWeight: weight }),
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

export default React.memo(AppText);
