import React, { useEffect, useMemo, useState } from "react";

import {
  FlatList,
  Pressable,
  View
} from "react-native";

import { useSelector } from "react-redux";

import {
  getAllGroupsAPI,
  getGroupsForUserAPI,
  joinGroupAPI,
} from "../api/groupApi";

import {
  Button,
  Card,
  Icon,
  Input,
  ScreenContainer,
  Text,
} from "../components";

import { RootState } from "../redux/store";

import { Colors, Spacing } from "../theme";
import { showToast } from "../utils/showToast";

export default function AllGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);

  const [search, setSearch] = useState("");

  const user = useSelector((state: RootState) => state.app.currentUser);

  const loadGroups = async () => {
    const allGroups = await getAllGroupsAPI();

    const joinedGroups = await getGroupsForUserAPI(user.uid);

    const joinedIds = joinedGroups.map((g: any) => g.groupId);

    const filtered = allGroups.filter(
      (group: any) => !joinedIds.includes(group.groupId)
    );

    setGroups(filtered);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleJoin = async (groupId: string, type: "MEMBER" | "GUEST") => {
    await joinGroupAPI(groupId, user.uid, type);

    alert(type === "MEMBER" ? "Request sent for approval" : "Joined as guest");

    loadGroups();
  };

  const filteredGroups = useMemo(() => {
    const value = search.toLowerCase();

    return groups.filter(
      (group: any) =>
        group.name?.toLowerCase().includes(value) ||
        group.groupId?.toLowerCase().includes(value)
    );
  }, [groups, search]);

  return (
    <ScreenContainer>
      <Input
        value={search}
        onChangeText={setSearch}
        label="Search Groups"
        placeholder="Search by group name or ID"
        leftIcon="search-outline"
        containerStyle={{
          // marginHorizontal: Spacing.lg,
          marginTop: 0,
          marginBottom: Spacing.lg,
        }}
      />

      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.groupId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: 120,
          flexGrow: filteredGroups.length === 0 ? 1 : undefined,
        }}
        renderItem={({ item }) => (
          <Card
            style={{
              padding: Spacing.lg,
              marginBottom: Spacing.lg,
              // alignSelf: "center",
            }}
          >
            {/* Header */}
            {/* Header */}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Spacing.lg,
              }}
            >
              {/* Avatar */}

              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: "#1A2234",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Text variant="subtitle" weight="700" color={Colors.primary}>
                  {item.name
                    ?.split(" ")
                    .map((x: string) => x[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </Text>
              </View>

              {/* Name + ID */}

              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                <Text variant="subtitle" weight="700">
                  {item.name}
                </Text>

                <Text
                  variant="caption"
                  color={Colors.textSecondary}
                  style={{
                    marginTop: 2,
                  }}
                >
                  ID • {item.groupId}
                </Text>
              </View>

              {/* Copy */}

              <Pressable
                onPress={async () => {
                  await Clipboard.setStringAsync(item.groupId);
                  alert("Group ID copied");
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon
                  name="copy-outline"
                  size={22}
                  color={Colors.textSecondary}
                  onPress={async () => {
                    showToast("Group ID copied");
                  }}
                />
              </Pressable>
            </View>

            <View
              style={{
                height: 1,
                backgroundColor: Colors.border,
                marginVertical: Spacing.sm,
              }}
            />
            {/* Stats */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: Spacing.xl,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Icon name="people-outline" size={18} color={Colors.primary} />

                <Text
                  variant="caption"
                  color={Colors.textSecondary}
                  style={{
                    marginTop: 4,
                  }}
                >
                  Total
                </Text>

                <Text variant="subtitle" weight="700">
                  {item.stats?.total || 0}
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Icon name="person-outline" size={18} color={Colors.success} />

                <Text
                  variant="caption"
                  color={Colors.textSecondary}
                  style={{
                    marginTop: 4,
                  }}
                >
                  Members
                </Text>

                <Text variant="subtitle" weight="700">
                  {item.stats?.members || 0}
                </Text>
              </View>

              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Icon
                  name="person-add-outline"
                  size={18}
                  color={Colors.warning}
                />

                <Text
                  variant="caption"
                  color={Colors.textSecondary}
                  style={{
                    marginTop: 4,
                  }}
                >
                  Guests
                </Text>

                <Text variant="subtitle" weight="700">
                  {item.stats?.guests || 0}
                </Text>
              </View>
            </View>

            {/* Actions */}

            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Button
                title="Member"
                leftIcon="person-add-outline"
                onPress={() => handleJoin(item.groupId, "MEMBER")}
                style={{
                  flex: 1,
                  marginRight: Spacing.sm,
                }}
              />

              <Button
                title="Guest"
                variant="outline"
                leftIcon="walk-outline"
                onPress={() => handleJoin(item.groupId, "GUEST")}
                style={{
                  flex: 1,
                }}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: Spacing.xl,
            }}
          >
            <Icon
              name="people-circle-outline"
              size={72}
              color={Colors.textMuted}
            />

            <Text
              variant="h3"
              align="center"
              style={{
                marginTop: Spacing.lg,
              }}
            >
              No Groups Found
            </Text>

            <Text
              variant="body"
              align="center"
              color={Colors.textSecondary}
              style={{
                marginTop: Spacing.sm,
              }}
            >
              We couldn't find any groups matching your search.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
