import { StyleSheet } from "react-native";

import {
  Colors,
  Spacing,
} from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
  },
});