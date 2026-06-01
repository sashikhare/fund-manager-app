import React, { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "./redux/store";

import { NavigationContainer } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import EventScreen from "./screens/EventScreen";
import FundScreen from "./screens/FundScreen";
import MemberEventScreen from "./screens/MemberEventScreen";
import MembersTabScreen from "./screens/MembersTabScreen";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth, db } from "./firebase/firebase";
import { setUser } from "./redux/appSlice";
import AccountScreen from "./screens/AccountScreen";
import AdminGroupTabScreen from "./screens/AdminGroupTabScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import SignupScreen from "./screens/auth/SignupScreen";
import GroupListScreen from "./screens/GroupListScreen";
import MemberGroupTabScreen from "./screens/MemberGroupTabScreen";
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
          if (route.name === "Groups") iconName = "people-outline";
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
          <Tab.Screen name="Groups" component={GroupListScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      )}
      {user?.role === "ADMIN" && (
        <>
          <Tab.Screen name="Events" component={EventScreen} />
          <Tab.Screen name="Members" component={MembersTabScreen} />
          <Tab.Screen name="Fund" component={FundScreen} />
          <Tab.Screen name="Groups" component={AdminGroupTabScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      )}
      {user?.role === "MEMBER" && (
        <>
          <Tab.Screen name="Groups" component={MemberGroupTabScreen} />
          <Tab.Screen name="Events" component={MemberEventScreen} />
          <Tab.Screen name="Fund" component={FundScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

const AppWrapper = () => {
  const user = useSelector((state: RootState) => state.app.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);
  
        if (userDoc.exists()) {
          dispatch(
            setUser({
              ...userDoc.data(),
              uid: firebaseUser.uid,
            })
          );
        } else {
          // 🔥 RECREATE USER IF MISSING
          const role =
            firebaseUser.email === "your@email.com"
              ? "SUPER_ADMIN"
              : "MEMBER";
  
          const newUser = {
            email: firebaseUser.email,
            role,
            createdAt: new Date().toISOString(),
          };
  
          await setDoc(userRef, newUser);
  
          dispatch(
            setUser({
              ...newUser,
              uid: firebaseUser.uid,
            })
          );
        }
      } else {
        dispatch(setUser(null));
      }
    });
  
    return unsubscribe;
  }, []);
  
  return (
    <NavigationContainer>
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
