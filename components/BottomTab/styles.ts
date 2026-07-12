import { StyleSheet } from "react-native";

import {
    Colors,
    Radius,
    Shadows,
    Spacing,
} from "../../theme";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Spacing.lg,
    right: Spacing.lg,
    bottom: Spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.lg,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.xl,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },

  activeTab: {
    backgroundColor: "#3B4047", // subtle gray like your reference
    borderRadius: Radius.xxl,
    // paddingVertical: 10,
},

  iconContainer: {
    marginBottom: 4,
  },

  label: {
    fontSize: 11,
  },
});