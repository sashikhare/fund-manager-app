import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";

import MembersListScreen from "./MembersListScreen";
import PendingApprovalScreen from "./PendingApprovalScreen";

const TopTab = createMaterialTopTabNavigator();

export default function MembersTabScreen() {
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
        name="Members List"
        component={MembersListScreen}
      />

      <TopTab.Screen
        name="Awaiting Approval"
        component={PendingApprovalScreen}
      />
    </TopTab.Navigator>
  );
}