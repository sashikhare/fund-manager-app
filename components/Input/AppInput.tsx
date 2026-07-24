import React, { useState } from "react";
import { Pressable, TextInput, View } from "react-native";

import { Colors } from "../../theme";

import AppIcon from "../Icon/AppIcon";
import AppText from "../Text/AppText";

import { styles } from "./styles";
import { AppInputProps } from "./types";

export default function AppInput({
  label,
  helperText,
  error,
  required = false,
  password = false,
  leftIcon,
  rightIcon,
  editable = true,
  containerStyle,
  optional,
  ...props
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <AppText variant="label" style={styles.label}>
          {label}

          {required && <AppText color={Colors.danger}>{" *"}</AppText>}
          {optional && (
            <AppText
              variant="label"
              color={Colors.textMuted}
              style={{ marginLeft: 6, fontSize: 8 }}
            >
              (Optional)
            </AppText>
          )}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,

          focused && styles.focused,

          !editable && styles.disabled,
        ]}
      >
        {leftIcon && (
          <AppIcon
            name={leftIcon}
            style={styles.icon}
            color={Colors.textSecondary}
          />
        )}

        <TextInput
          {...props}
          editable={editable}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={hidePassword}
          style={styles.input}
          onFocus={(e) => {
            setFocused(true);

            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);

            props.onBlur?.(e);
          }}
        />

        {password ? (
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <AppIcon
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              style={styles.rightIcon}
              color={Colors.textSecondary}
            />
          </Pressable>
        ) : rightIcon ? (
          <AppIcon
            name={rightIcon}
            style={styles.rightIcon}
            color={Colors.textSecondary}
          />
        ) : null}
      </View>

      {(error || helperText) && (
        <AppText
          variant="caption"
          color={error ? Colors.danger : Colors.textMuted}
          style={styles.helper}
        >
          {error || helperText}
        </AppText>
      )}
    </View>
  );
}
