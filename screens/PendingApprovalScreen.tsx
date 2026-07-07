import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";

import {
  approveMemberAPI,
  getPendingMembersAPI,
} from "../api/memberApi";

import {
  Button,
  Card,
  Icon,
  ScreenContainer,
  Text,
} from "../components";

import { Colors, Spacing } from "../theme";

import { RootState } from "../redux/store";

export default function PendingApprovalScreen() {
  const [members, setMembers] = useState<any[]>([]);

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const loadMembers = async () => {
    if (!selectedGroup?.id) return;

    const data = await getPendingMembersAPI(
      selectedGroup.id
    );

    setMembers(data);
  };

  useEffect(() => {
    loadMembers();
  }, [selectedGroup]);

  const handleApprove = async (
    relationId: string
  ) => {
    await approveMemberAPI(relationId);

    loadMembers();
  };

  if (!selectedGroup?.id) {
    return (
      <ScreenContainer>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: Spacing.xl,
          }}
        >
          <Icon
            name="people-outline"
            size={56}
            color={Colors.textMuted}
          />

          <Text
            variant="h3"
            align="center"
            style={{
              marginTop: Spacing.lg,
            }}
          >
            No Group Selected
          </Text>

          <Text
            variant="body"
            color={Colors.textSecondary}
            align="center"
            style={{
              marginTop: Spacing.sm,
            }}
          >
            Please select a group to
            approve pending members.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={members}
        keyExtractor={(item) => item.relationId}
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingBottom: 120,
          gap: Spacing.md,
          flexGrow: members.length === 0 ? 1 : undefined,
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
              name="checkmark-circle-outline"
              size={56}
              color={Colors.success}
            />

            <Text
              variant="h3"
              align="center"
              style={{
                marginTop: Spacing.lg,
              }}
            >
              No Pending Requests
            </Text>

            <Text
              variant="body"
              color={Colors.textSecondary}
              align="center"
              style={{
                marginTop: Spacing.sm,
              }}
            >
              All member requests have
              already been approved.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: Spacing.lg,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: Colors.primaryLight,
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: Spacing.md,
                }}
              >
                <Icon
                  name="person-outline"
                  size={24}
                  color={Colors.primary}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text variant="h4">
                  {item.firstName} {item.lastName}
                </Text>

                {item.email ? (
                  <Text
                    variant="bodySmall"
                    color={Colors.textSecondary}
                  >
                    {item.email}
                  </Text>
                ) : null}
              </View>
            </View>

            <Button
              title="Approve"
              leftIcon="checkmark-circle-outline"
              onPress={() =>
                handleApprove(item.relationId)
              }
              fullWidth
            />
          </Card>
        )}
      />
    </ScreenContainer>
  );
}