import React, { ReactNode } from "react";
import { Linking, Pressable, PressableProps } from "react-native";
import { openBrowserAsync, WebBrowserPresentationStyle } from "expo-web-browser";

type Props = Omit<PressableProps, "onPress"> & {
  href: string;
  children: ReactNode;
};

export function ExternalLink({ href, children, ...rest }: Props) {
  const handlePress = async () => {
    if (process.env.EXPO_OS !== "web") {
      await openBrowserAsync(href, {
        presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
      });
      return;
    }

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
