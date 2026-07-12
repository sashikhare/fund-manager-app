import React from "react";
import {
  StatusBar,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "../../theme";

import { styles } from "./styles";

import { ScreenContainerProps } from "./types";

export default function ScreenContainer({
  children,
}: ScreenContainerProps) {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.background}
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          {children}
        </View>
      </SafeAreaView>
    </>
  );
}