import { subscribeGroupsByAdminAPI } from "@/api/groupApi";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  Icon,
  Interactive,
  Text,
} from "../components";

import { setSelectedGroup } from "../redux/appSlice";
import { RootState } from "../redux/store";

import {
  Colors,
  Radius,
  Spacing,
} from "../theme";

export default function GroupListScreen() {
  const dispatch = useDispatch();

  const user = useSelector(
    (state: RootState) => state.app.currentUser
  );

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    if (!user?.email) return;

    const unsubscribe = subscribeGroupsByAdminAPI(
      user.email,
      (data) => {
        setGroups(data);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="people-circle-outline"
        size={72}
        color={Colors.textMuted}
      />

      <Text
        variant="h3"
        weight="600"
        align="center"
        style={styles.emptyTitle}
      >
        No Groups Found
      </Text>

      <Text
        variant="body"
        align="center"
        color={Colors.textSecondary}
      >
        Create your first group from the{" "}
        <Text weight="600">Create Group</Text> tab.
      </Text>
    </View>
  );

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.container,
        groups.length === 0 && styles.emptyList,
      ]}
      ListEmptyComponent={renderEmpty}
      renderItem={({ item }) => {
        const isSelected =
          selectedGroup?.id === item.groupId;

        return (
          <Interactive
            onPress={() =>
              dispatch(
                setSelectedGroup({
                  id: item.groupId,
                  name: item.name,
                })
              )
            }
          >
            <Card
              style={[
                styles.card,
                isSelected && styles.selectedCard,
              ]}
            >
              <View style={styles.header}>
                <View style={styles.titleRow}>
                  <Icon
                    name="football-outline"
                    color={Colors.primary}
                  />

                  <Text
                    variant="title"
                    weight="700"
                  >
                    {item.name}
                  </Text>
                </View>

                {isSelected && (
                  <Icon
                    name="checkmark-circle"
                    color={Colors.success}
                  />
                )}
              </View>

              <View style={styles.infoRow}>
                <Icon
                  name="pricetag-outline"
                  size={18}
                  color={Colors.textMuted}
                />

                <Text
                  variant="bodySmall"
                  color={Colors.textSecondary}
                >
                  Group ID : {item.groupId}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Icon
                  name="wallet-outline"
                  size={18}
                  color={Colors.textMuted}
                />

                <Text
                  variant="bodySmall"
                  color={Colors.textSecondary}
                >
                  Member Fee : ₹{item.memberFee}
                </Text>
              </View>

              {isSelected && (
                <View style={styles.badge}>
                  <Text
                    variant="caption"
                    weight="600"
                    color={Colors.primary}
                  >
                    Current Group
                  </Text>
                </View>
              )}
            </Card>
          </Interactive>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: Spacing.xxxl,
  },

  emptyTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  card: {
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  selectedCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceGlass,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  badge: {
    alignSelf: "flex-start",
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
  },
});