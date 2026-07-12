import React, { useEffect, useState } from "react";

import { FlatList, View } from "react-native";

import { useDispatch, useSelector } from "react-redux";

import { getGroupStatsAPI, subscribeGroupsForUserAPI } from "@/api/groupApi";

import { Card, Icon, ScreenContainer, Text } from "../components";

import { setSelectedGroup } from "../redux/appSlice";

import { RootState } from "../redux/store";

import { Colors, Spacing } from "../theme";

export default function JoinedGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);

  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.app.currentUser);

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeGroupsForUserAPI(user.uid, async (data) => {
      const groupsWithStats = await Promise.all(
        data.map(async (group: any) => {
          const stats = await getGroupStatsAPI(group.groupId);

          return {
            ...group,
            stats,
          };
        })
      );

      setGroups(groupsWithStats);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <ScreenContainer>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.groupId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: 120,
          flexGrow: groups.length === 0 ? 1 : undefined,
        }}
        renderItem={({ item }) => {
          const isSelected = selectedGroup?.id === item.groupId;

          return (
            <Card
              onPress={() =>
                dispatch(
                  setSelectedGroup({
                    id: item.groupId,
                    name: item.name,
                  })
                )
              }
              style={{
                marginBottom: Spacing.lg,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? Colors.primary : Colors.border,
              }}
            >
              {/* Selected Badge */}

              {isSelected && (
                <View
                  style={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: Colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1,
                  }}
                >
                  <Icon name="checkmark" size={16} color="#fff" />
                </View>
              )}

              {/* Header */}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
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

                {/* Name */}

                <View
                  style={{
                    flex: 1,
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
              </View>

              {/* Divider */}

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.border,
                  marginVertical: Spacing.lg,
                }}
              />

              {/* Stats */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="people-outline"
                    size={18}
                    color={Colors.primary}
                  />

                  <Text
                    variant="h3"
                    weight="700"
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {item.stats?.members || 0}
                  </Text>

                  <Text variant="caption" color={Colors.textSecondary}>
                    Members
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="person-add-outline"
                    size={18}
                    color={Colors.warning}
                  />

                  <Text
                    variant="h3"
                    weight="700"
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {item.stats?.guests || 0}
                  </Text>

                  <Text variant="caption" color={Colors.textSecondary}>
                    Guests
                  </Text>
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="people-outline"
                    size={18}
                    color={Colors.primary}
                  />

                  <Text
                    variant="h3"
                    weight="700"
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {item.stats?.total || 0}
                  </Text>

                  <Text variant="caption" color={Colors.textSecondary}>
                    Total
                  </Text>
                </View>
              </View>

              {/* Divider */}

              <View
                style={{
                  height: 1,
                  backgroundColor: Colors.border,
                  marginVertical: Spacing.lg,
                }}
              />

              {/* Membership */}

              <View
                style={{
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 18,
                    paddingVertical: 8,
                    borderRadius: 999,
                    backgroundColor:
                      item.membershipType === "GUEST"
                        ? "#3B3B3B"
                        : item.status === "APPROVED"
                        ? "#143D26"
                        : "#4A3205",
                  }}
                >
                  <Text
                    variant="caption"
                    weight="700"
                    color={
                      item.membershipType === "GUEST"
                        ? "#FFFFFF"
                        : item.status === "APPROVED"
                        ? "#32D583"
                        : "#FDB022"
                    }
                  >
                    {item.membershipType === "GUEST"
                      ? "GUEST"
                      : item.status === "APPROVED"
                      ? "MEMBER"
                      : "AWAITING APPROVAL"}
                  </Text>
                </View>
              </View>
            </Card>
          );
        }}
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
              No Groups Joined
            </Text>

            <Text
              variant="body"
              align="center"
              color={Colors.textSecondary}
              style={{
                marginTop: Spacing.sm,
              }}
            >
              You haven't joined any groups yet.
            </Text>

            <Text
              variant="caption"
              align="center"
              color={Colors.textMuted}
              style={{
                marginTop: Spacing.xs,
              }}
            >
              Browse available groups from the "Join Group" tab.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}
