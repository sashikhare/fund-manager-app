import React from "react";
import { View } from "react-native";

import AppIcon from "../Icon/AppIcon";
import AppText from "../Text/AppText";

import { Colors, IconSize } from "../../theme";

import { styles } from "./styles";

import { BrandProps } from "./types";

function Brand({
  title = "Turf Fund",

  subtitle = "Play Together.\nManage Smarter.",
}: BrandProps) {
  return (
    <View style={styles.container}>
      <AppIcon
        name="football-outline"
        size={IconSize.display}
        color={Colors.primary}
        style={styles.logo}
      />

      <AppText variant="display" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="subtitle" align="center" style={styles.subtitle}>
        {subtitle}
      </AppText>
    </View>
  );
}

export default React.memo(Brand);