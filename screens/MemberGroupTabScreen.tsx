import React from "react";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import AllGroupsScreen from "./AllGroupsScreen";
import JoinedGroupsScreen from "./JoinedGroupsScreen";

const TopTab =
  createMaterialTopTabNavigator();

export default function MemberGroupTabScreen() {
  return (
    <TopTab.Navigator
    //   screenOptions={{
    //     tabBarStyle: {
    //       backgroundColor: "#111",
    //     },

    //     tabBarActiveTintColor: "#fff",

    //     tabBarIndicatorStyle: {
    //       backgroundColor: "#007AFF",
    //     },
    //   }}
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