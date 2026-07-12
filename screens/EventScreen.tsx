import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { useSelector } from "react-redux";

import { Colors, Typography } from "../theme";

import { RootState } from "../redux/store";

import CreateEventTab from "./CreateEventTab";
import EventListTab from "./EventListTab";

const Tab = createMaterialTopTabNavigator();

export default function EventScreen() {
  const events = useSelector(
    (state: RootState) => state.app.events
  );

  const pendingCount = events.filter(
    (e) => !e.isSettled
  ).length;

  return (
    <Tab.Navigator
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
          paddingTop: 50, // Same as other Top Tabs
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
      <Tab.Screen
        name="Create Event"
        component={CreateEventTab}
      />

      <Tab.Screen
        name="Event List"
        component={EventListTab}
        options={{
          tabBarLabel:
            pendingCount > 0
              ? `Events (${pendingCount})`
              : "Events",
        }}
      />
    </Tab.Navigator>
  );
}