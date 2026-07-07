import React from "react";
import { Pressable, View } from "react-native";

import Icon from "../Icon";
import Text from "../Text";

import { Colors } from "../../theme";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./styles";
import { BottomTabProps } from "./types";
const getIcon = (routeName: string, focused: boolean): any => {
  switch (routeName) {
    case "Members":
      return focused ? "people" : "people-outline";

    case "Fund":
      return focused ? "wallet" : "wallet-outline";

    case "Events":
      return focused ? "football" : "football-outline";

    case "Groups":
      return focused ? "layers" : "layers-outline";

    case "Account":
      return focused ? "person-circle" : "person-circle-outline";

    case "Admin":
      return focused ? "shield-checkmark" : "shield-checkmark-outline";

    default:
      return "ellipse-outline";
  }
};

export default function BottomTab({
  state,
  descriptors,
  navigation,
}: BottomTabProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          bottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;

        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as any);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[styles.tab, focused && styles.activeTab]}
          >
            <View style={styles.iconContainer}>
              <Icon
                name={getIcon(route.name, focused)}
                size={22}
                color={focused ? Colors.primary : Colors.textMuted}
              />
            </View>

            <Text
              variant="caption"
              color={focused ? Colors.primary : Colors.textMuted}
              weight={focused ? "700" : "500"}
              align="center"
              style={styles.label}
            >
              {String(label)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
