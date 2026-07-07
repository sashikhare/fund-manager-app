import React from "react";
import { Animated, StyleSheet } from "react-native";
import { Colors, Radius, Shadows, Spacing } from "../../theme";
import AppText from "../Text/AppText";

interface SnackbarProps {
  message: string;
  visible: boolean;
}

export default function Snackbar({
  message,
  visible,
}: SnackbarProps) {
  if (!visible) return null;

  return (
    <Animated.View style={styles.container}>
      <AppText
        variant="body"
        style={styles.text}
      >
        {message}
      </AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,

    backgroundColor: Colors.surface,

    borderRadius: Radius.lg,

    padding: Spacing.lg,

    ...Shadows.card,
  },

  text: {
    color: Colors.text,
  },
});