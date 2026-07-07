import React from "react";
import { View } from "react-native";
import { Colors } from "../../theme";
import Gradient from "../Gradient";
import BackgroundCircle from "./BackgroundCircle";
import { styles } from "./styles";
import { AnimatedBackgroundProps } from "./types";

export default function AnimatedBackground({
  children,
}: AnimatedBackgroundProps) {
  return (
    <Gradient>
      {/* Top Right */}
      <BackgroundCircle
        size={260}
        color={Colors.primary}
        opacity={0.08}
        top={-80}
        right={-80}
        duration={4500}
        direction="up"
      />

      {/* Bottom Left */}
      <BackgroundCircle
        size={220}
        color={Colors.primary}
        opacity={0.06}
        bottom={-60}
        left={-70}
        duration={6000}
        direction="down"
      />

      {/* Center */}
      <BackgroundCircle
        size={140}
        color={Colors.primary}
        opacity={0.05}
        top="40%"
        right={-40}
        duration={5200}
        direction="up"
      />

      <View style={styles.content}>{children}</View>
    </Gradient>
  );
}
