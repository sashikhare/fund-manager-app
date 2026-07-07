import { StyleSheet } from "react-native";

import {
    Colors,
    Radius,
    Shadows,
} from "../../theme";

export const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceGlass,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    ...Shadows.md,
  },
});