import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";

import { logoutAPI } from "../api/authApi";
import {
  AnimatedBackground,
  Button,
  Card,
  Icon,
  ScreenContainer,
  Text,
} from "../components";
import { RootState } from "../redux/store";
import {
  Colors,
  Radius,
  Shadows,
  Spacing,
} from "../theme";

export default function AccountScreen() {
  const user = useSelector(
    (state: RootState) => state.app.currentUser
  );

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const handleLogout = async () => {
    await logoutAPI();
  };

  const initials = `${user?.firstName?.charAt(0) || ""}${
    user?.lastName?.charAt(0) || ""
  }`.toUpperCase();

  return (
    <AnimatedBackground>
      <ScreenContainer>
        <View style={styles.container}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text
              variant="h2"
              weight="700"
              color={Colors.primary}
            >
              {initials}
            </Text>
          </View>

          {/* Name */}
          <Text
            variant="h2"
            weight="700"
            align="center"
            style={styles.name}
          >
            {user?.firstName} {user?.lastName}
          </Text>

          {/* Role */}
          <View style={styles.roleBadge}>
            <Text
              variant="bodySmall"
              weight="600"
              color={Colors.primary}
            >
              {user?.role}
            </Text>
          </View>

          {/* Group Card */}
          <Card style={styles.groupCard}>
            <View style={styles.row}>
              <Icon
                name="people-outline"
                color={Colors.primary}
              />

              <Text
                variant="subtitle"
                weight="600"
              >
                Current Group
              </Text>
            </View>

            <Text
              variant="body"
              color={Colors.textSecondary}
              style={styles.groupName}
            >
              {selectedGroup?.name || "No group selected"}
            </Text>
          </Card>

          {/* Logout */}
          <Button
            title="Logout"
            variant="danger"
            leftIcon="log-out-outline"
            onPress={handleLogout}
            style={styles.logout}
          />
        </View>
      </ScreenContainer>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: Radius.full,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.surfaceGlass,
    borderWidth: 1,
    borderColor: Colors.primary,
    ...Shadows.md,
  },

  name: {
    marginTop: Spacing.xl,
  },

  roleBadge: {
    alignSelf: "center",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },

  groupCard: {
    marginTop: Spacing.xxxl,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  groupName: {
    marginTop: Spacing.md,
  },

  logout: {
    marginTop: Spacing.xxxl,
  },
});