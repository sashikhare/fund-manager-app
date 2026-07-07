import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import CreateGroupScreen from "./CreateGroupScreen";
import GroupListScreen from "./GroupListScreen";

import {
  Colors,
  Radius,
  Spacing,
  Typography
} from "../theme";

const TopTab = createMaterialTopTabNavigator();

export default function AdminGroupTabScreen() {
  return (
    <TopTab.Navigator
      screenOptions={{
        sceneStyle: {
    backgroundColor: Colors.background,
  },
        tabBarStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
          paddingTop: 50,
        },

        tabBarIndicatorStyle: {
          backgroundColor: Colors.primary,
          height: 3,
          borderRadius: Radius.full,
        },

        tabBarLabelStyle: {
          ...Typography.button,
          textTransform: "none",
        },

        tabBarActiveTintColor: Colors.primary,

        tabBarInactiveTintColor: Colors.textMuted,

        tabBarPressColor: "transparent",

        tabBarItemStyle: {
          paddingVertical: Spacing.sm,
        },

        tabBarContentContainerStyle: {
          paddingHorizontal: Spacing.md,
        },

        lazy: true,
      }}
    >
      <TopTab.Screen
        name="Create Group"
        component={CreateGroupScreen}
      />

      <TopTab.Screen
        name="My Groups"
        component={GroupListScreen}
      />
    </TopTab.Navigator>
  );
}