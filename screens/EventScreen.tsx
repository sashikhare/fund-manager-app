import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CreateEventTab from "./CreateEventTab";
import EventListTab from "./EventListTab";

const Tab = createMaterialTopTabNavigator();

export default function EventScreen() {
  const events = useSelector((state: RootState) => state.app.events);

  const pendingCount = events.filter((e) => !e.isSettled).length;
  return (
    <Tab.Navigator>
      <Tab.Screen name="Create Event" component={CreateEventTab} />
      <Tab.Screen
        name="Event List"
        component={EventListTab}
        options={{
          tabBarLabel: pendingCount > 0 ? `Events (${pendingCount})` : "Events",
        }}
      />
    </Tab.Navigator>
  );
}
