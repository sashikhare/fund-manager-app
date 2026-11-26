import React, { ReactNode } from "react";
import { Linking, Pressable, PressableProps } from "react-native";

type Props = Omit<PressableProps, "onPress"> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async () => {
    await Linking.openURL(href);
  };

  return (
    <Pressable
      {...rest}
      accessibilityRole="link"
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
}
