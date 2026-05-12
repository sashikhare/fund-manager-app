import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./redux/store";

import { NavigationContainer } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventScreen from "./screens/EventScreen";
import FundScreen from "./screens/FundScreen";
import MembersScreen from "./screens/MembersScreen";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth, db } from "./firebase/firebase";
import { setUser } from "./redux/appSlice";
import AccountScreen from "./screens/AccountScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import SuperAdminScreen from "./screens/SuperAdminScreen";
export type RootStackParamList = {
  Members: undefined;
  Fund: undefined;
  Event: undefined;
};

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const user = useSelector((state: RootState) => state.app.currentUser);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;

          if (route.name === "Members") iconName = "people";
          if (route.name === "Fund") iconName = "wallet";
          if (route.name === "Events") iconName = "calendar";
          if (route.name === "Account") iconName = "person";
          if (route.name === "Admin") iconName = "settings";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
      })}
    >
      {user?.role === "SUPER_ADMIN" && (
        <>
          <Tab.Screen name="Admin" component={SuperAdminScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      )}
      {user?.role === "ADMIN" && (
        <>
          <Tab.Screen name="Events" component={EventScreen} />
          <Tab.Screen name="Members" component={MembersScreen} />
          <Tab.Screen name="Fund" component={FundScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

const AppWrapper = () => {
  const user = useSelector((state: RootState) => state.app.currentUser);
  console.log("Current user:", user);
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

        if (userDoc.exists()) {
          dispatch(setUser(userDoc.data()));
        } else {
          dispatch(setUser(null));
        }
      } else {
        // 🔥 THIS WAS MISSING
        dispatch(setUser(null));
      }
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer key={user ? "app" : "auth"}>
      {!user ? <AuthStack /> : <MainTabs />}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <Provider store={store}>
          <AppWrapper />
        </Provider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
