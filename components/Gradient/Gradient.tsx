import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Gradients } from "../../theme";

import { styles } from "./styles";
import { GradientProps } from "./types";

function Gradient({
  children,
  colors = Gradients.background,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  ...props
}: GradientProps) {
  return (
    <LinearGradient
      {...props}
      colors={colors}
      start={start}
      end={end}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

export default React.memo(Gradient);