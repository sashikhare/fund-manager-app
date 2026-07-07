import React from "react";
import {
    ActivityIndicator,
    View,
} from "react-native";

import { Animation, Colors } from "../../theme";

import { Interactive } from "../Animated";
import AppIcon from "../Icon/AppIcon";
import AppText from "../Text/AppText";

import { styles } from "./styles";
import { AppButtonProps } from "./types";

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Interactive
      onPress={onPress}
      disabled={isDisabled}
      pressedScale={Animation.scale.button}
      style={[
        styles.button,
        styles[size],
        styles[variant],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <>
            {leftIcon && (
              <AppIcon
                name={leftIcon}
                style={styles.iconLeft}
              />
            )}

            <AppText
              variant={
                size === "large"
                  ? "buttonLarge"
                  : size === "small"
                  ? "buttonSmall"
                  : "button"
              }
            >
              {title}
            </AppText>

            {rightIcon && (
              <AppIcon
                name={rightIcon}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </View>
    </Interactive>
  );
}