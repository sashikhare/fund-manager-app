import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../../App";
import {
  createMemberAPI,
  deleteMemberAPI,
  getMembersByGroupAPI,
} from "../api/memberApi";
import { addMember, deleteMembers, setMembers } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

type Props = NativeStackScreenProps<RootStackParamList, "Members">;

export default function MembersListScreen({ navigation }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const members = useSelector((state: RootState) => state.app.members);
  const dispatch = useDispatch();

  const isSelectionMode = selectedIds.length > 0;
  const hasMembers = members.length > 0;
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  // useEffect(() => {
  //   const unsubscribe = subscribeMembers((data) => {
  //     dispatch(setMembers(data));
  //   });

  //   return () => unsubscribe(); // cleanup
  // }, []);

  const groupId = useSelector((state: RootState) => state.app.selectedGroup);

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const load = async () => {
      const data = await getMembersByGroupAPI(selectedGroup.id);
      dispatch(setMembers(data));
    };

    load();
  }, [selectedGroup]);

  useEffect(() => {
    setSelectedIds((prev) =>
      prev.filter((id) => members.some((m) => m.id === id))
    );
  }, [members]);

  const handleAdd = async () => {
    if (!firstName || !lastName) return;
    const tempId = Date.now().toString();

    const newMember = {
      id: tempId,
      firstName,
      lastName,
    };

    dispatch(addMember(newMember)); // keep UI in sync
    setShowModal(false);
    setFirstName("");
    setLastName("");
    try {
      const saved = await createMemberAPI({ firstName, lastName });
    } catch (e) {
      console.error("API error", e);
      // rollback (optional)
      dispatch(deleteMembers([tempId]));
    }
  };

  const handleDelete = async () => {
    const ids = [...selectedIds];
    await Promise.all(ids.map((id) => deleteMemberAPI(id)));
    // for (let id of selectedIds) {
    //   await deleteMemberAPI(id);
    // }
    dispatch(deleteMembers(selectedIds));
    setSelectedIds([]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isSelectionMode ? `${selectedIds.length} selected` : "Members",
      headerRight: () =>
        isSelectionMode && hasMembers ? (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash" size={22} color="red" />
          </TouchableOpacity>
        ) : null,
    });
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Pressable style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {members.length === 0 && (
        <View style={{ alignItems: "center", marginTop: 50 }}>
          <Text style={{ color: "#999" }}>No members added yet</Text>
        </View>
      )}

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 10, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <Pressable
              onPress={() => toggleSelect(item.id)}
              style={({ pressed }) => [
                styles.memberCard,
                isSelected && styles.memberCardSelected,
                pressed && { opacity: 0.8 },
              ]}
            >
              <View style={styles.memberRow}>
                {/* Avatar */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(item.firstName?.[0] || "").toUpperCase()}
                    {(item.lastName?.[0] || "").toUpperCase()}
                  </Text>
                </View>

                {/* Name */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 6,
                    alignSelf: "flex-start",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,

                    backgroundColor:
                      item.membershipType === "GUEST"
                        ? "#444"
                        : item.status === "APPROVED"
                        ? "#1f7a1f"
                        : "#8a6d1d",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "600",
                    }}
                  >
                    {item.membershipType === "GUEST"
                      ? "GUEST"
                      : item.status === "APPROVED"
                      ? "MEMBER"
                      : "Awaiting Approval"}
                  </Text>
                </View>

                {/* Checkbox */}
                <Text style={styles.checkbox}>{isSelected ? "✔️" : ""}</Text>
              </View>
            </Pressable>
          );
        }}
      />

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Member</Text>
            <Text style={styles.modalSubtitle}>Enter member details</Text>

            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              placeholderTextColor="#aaa"
              style={styles.modalInput}
            />

            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              placeholderTextColor="#aaa"
              style={styles.modalInput}
            />

            <Pressable
              style={({ pressed }) => [
                styles.modalBtn,
                pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
              ]}
              // onPr
              onPress={handleAdd}
            >
              <Text style={styles.modalBtnText}>Add</Text>
            </Pressable>

            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* <Button title="Go to Fund" onPress={() => navigation.navigate("Fund")} /> */}
    </View>
  );
}
