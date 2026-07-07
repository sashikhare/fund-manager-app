import { StyleSheet } from "react-native";
import {
    Colors,
    Radius,
    Shadows,
    Size,
    Spacing,
} from "../../theme";

export const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: Radius.lg,

    paddingHorizontal: Spacing.xxl,

    ...Shadows.md,
  },

  fullWidth: {
    width: "100%",
  },

  small: {
    height: Size.buttonHeightSmall,
  },

  medium: {
    height: Size.buttonHeight,
  },

  large: {
    height: Size.buttonHeightLarge,
  },

  primary: {
    backgroundColor: Colors.primary,
  },

  secondary: {
    backgroundColor: Colors.surfaceElevated,
  },

  ghost: {
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
  },

  danger: {
    backgroundColor: Colors.danger,
  },

  disabled: {
    backgroundColor: Colors.buttonDisabled,
    opacity: 0.7,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconLeft: {
    marginRight: Spacing.sm,
  },

  iconRight: {
    marginLeft: Spacing.sm,
  },
});