import { TextStyle } from "react-native";
import { Colors } from "./colors";

export const Typography: Record<string, TextStyle> = {
  // Hero
  display: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -1,
    lineHeight: 50,
  },

  // Headings
  h1: {
    fontSize: 34,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.8,
    lineHeight: 40,
  },

  h2: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    letterSpacing: -0.6,
    lineHeight: 34,
  },

  h3: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 28,
  },

  // Titles
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    lineHeight: 24,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    lineHeight: 22,
  },

  // Body
  body: {
    fontSize: 16,
    fontWeight: "400",
    color: Colors.text,
    lineHeight: 24,
  },

  bodyMedium: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Labels
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Caption
  caption: {
    fontSize: 12,
    fontWeight: "400",
    color: Colors.textMuted,
    lineHeight: 16,
  },

  // Overline
  overline: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textMuted,
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // Buttons
  buttonSmall: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.white,
  },

  button: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.white,
  },

  buttonLarge: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
  },
} as const;