import React, { useEffect, useState } from "react";

import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import * as Clipboard from "expo-clipboard";

import {
    getAllGroupsAPI,
    getGroupsForUserAPI,
    joinGroupAPI,
} from "../api/groupApi";

import { styles } from "../styles/mainStyles";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function AllGroupsScreen() {
  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const user = useSelector((state: RootState) => state.app.currentUser);

  const loadGroups = async () => {
    // 1. Get all groups
    const allGroups = await getAllGroupsAPI();

    // 2. Get joined groups
    const joinedGroups = await getGroupsForUserAPI(user.uid);

    // 3. Extract joined IDs
    const joinedIds = joinedGroups.map((g: any) => g.groupId);

    // 4. Remove joined groups
    const filteredGroups = allGroups.filter(
      (group: any) => !joinedIds.includes(group.groupId)
    );

    setGroups(filteredGroups);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleJoin = async (groupId: string, type: "MEMBER" | "GUEST") => {
    await joinGroupAPI(groupId, user.uid, type);

    alert(type === "MEMBER" ? "Request sent for approval" : "Joined as guest");

    loadGroups();
  };

  const filteredGroups = groups.filter((group: any) => {
    const value = search.toLowerCase();

    return (
      group.name?.toLowerCase().includes(value) ||
      group.groupId?.toLowerCase().includes(value)
    );
  });

  return (
    <>
      <TextInput
        placeholder="Search by group name or ID"
        placeholderTextColor="#999"
        value={search}
        onChangeText={setSearch}
        style={{
          backgroundColor: "#1c1c1e",
          margin: 16,
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: "#fff",
        }}
      />
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.groupId}
        contentContainerStyle={{
          padding: 16,
        }}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            <Text style={styles.memberName}>{item.name}</Text>

            <Text
              style={{
                color: "#aaa",
                marginTop: 6,
              }}
            >
              Group ID: {item.groupId}
            </Text>

            <Text
              style={{
                color: "#aaa",
                marginTop: 6,
              }}
            >
              Total: {item.stats?.total || 0}
            </Text>

            <Text style={{ color: "#aaa" }}>
              Members: {item.stats?.members || 0}
            </Text>

            <Text style={{ color: "#aaa" }}>
              Guests: {item.stats?.guests || 0}
            </Text>

            <Pressable
              onPress={async () => {
                await Clipboard.setStringAsync(item.groupId);

                alert("Copied");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Ionicons name="copy-outline" size={18} color="#007AFF" />

              <Text
                style={{
                  color: "#007AFF",
                  marginLeft: 6,
                }}
              >
                Copy Group ID
              </Text>
            </Pressable>

            <View
              style={{
                flexDirection: "row",
              }}
            >
              {/* MEMBER */}
              <Pressable
                style={[
                  styles.primaryBtn,
                  {
                    flex: 1,
                    marginRight: 8,
                  },
                ]}
                onPress={() => handleJoin(item.groupId, "MEMBER")}
              >
                <Text style={styles.primaryBtnText}>Member</Text>
              </Pressable>

              {/* GUEST */}
              <Pressable
                style={[
                  styles.guestSecondaryBtn,
                  {
                    flex: 1,
                  },
                ]}
                onPress={() => handleJoin(item.groupId, "GUEST")}
              >
                <Text style={styles.secondaryBtnText}>Guest</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              marginTop: 80,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999" }}>No groups found</Text>
          </View>
        )}
      />
    </>
  );
}
