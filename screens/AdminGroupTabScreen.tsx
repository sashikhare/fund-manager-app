import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import CreateGroupScreen from "./CreateGroupScreen";
import GroupListScreen from "./GroupListScreen";

const TopTab = createMaterialTopTabNavigator();

export default function AdminGroupTabScreen() {
  return (
    <TopTab.Navigator
    //   screenOptions={{
    //     tabBarLabelStyle: { fontSize: 12 },
    //     tabBarStyle: { backgroundColor: "#111" },
    //     tabBarActiveTintColor: "#fff",
    //     tabBarIndicatorStyle: { backgroundColor: "#007AFF" },
    //   }}
    >
      <TopTab.Screen name="Create" component={CreateGroupScreen} />
      <TopTab.Screen name="My Groups" component={GroupListScreen} />
    </TopTab.Navigator>
  );
}