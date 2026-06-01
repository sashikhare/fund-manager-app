import React, { useEffect, useState } from "react";

import {
    FlatList,
    Pressable,
    Text,
    View,
} from "react-native";

import { useSelector } from "react-redux";

import {
    approveMemberAPI,
    getPendingMembersAPI,
} from "../api/memberApi";

import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#999" }}>
          Please select a group
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.relationId}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.memberCard}>
          <Text style={styles.memberName}>
            {item.firstName} {item.lastName}
          </Text>

          <Pressable
            style={[
              styles.primaryBtn,
              { marginTop: 12 },
            ]}
            onPress={() =>
              handleApprove(item.relationId)
            }
          >
            <Text style={styles.primaryBtnText}>
              Approve
            </Text>
          </Pressable>
        </View>
      )}
    />
  );
}