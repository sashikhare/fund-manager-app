import { StyleSheet } from "react-native";

import { ZIndex } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    zIndex: ZIndex.content,
  },
});