import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import { Colors, Typography } from "../theme";

import AllGroupsScreen from "./AllGroupsScreen";
import JoinedGroupsScreen from "./JoinedGroupsScreen";

const TopTab = createMaterialTopTabNavigator();

export default function MemberGroupTabScreen() {
  return (
    <TopTab.Navigator
      sceneStyle={{
        backgroundColor: Colors.background,
      }}
      screenOptions={{
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
          borderRadius: 999,
        },

        tabBarActiveTintColor: Colors.textPrimary,

        tabBarInactiveTintColor: Colors.textSecondary,

        tabBarLabelStyle: {
          ...Typography.bodyMedium,
          fontWeight: "700",
          textTransform: "none",
        },

        tabBarPressColor: "transparent",

        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <TopTab.Screen
        name="My Groups"
        component={AllGroupsScreen}
      />

      <TopTab.Screen
        name="Join Group"
        component={JoinedGroupsScreen}
      />
    </TopTab.Navigator>
  );
}