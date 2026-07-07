import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { RootStackParamList } from "../../App";

import {
  createMemberAPI,
  deleteMemberAPI,
  getMembersByGroupAPI,
} from "../api/memberApi";

import {
  Button,
  Card,
  Icon,
  Input,
  ScreenContainer,
  Text,
} from "../components";

import { addMember, deleteMembers, setMembers } from "../redux/appSlice";

import { RootState } from "../redux/store";

import { Colors, Layout, Radius, Shadows, Spacing } from "../theme";

type Props = NativeStackScreenProps<RootStackParamList, "Members">;

export default function MembersListScreen({ navigation }: Props) {
  const dispatch = useDispatch();

  const members = useSelector((state: RootState) => state.app.members);

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const isSelectionMode = selectedIds.length > 0;

  const hasMembers = members.length > 0;

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

    dispatch(addMember(newMember));

    setShowModal(false);

    setFirstName("");

    setLastName("");

    try {
      await createMemberAPI({
        firstName,
        lastName,
      });
    } catch (e) {
      dispatch(deleteMembers([tempId]));
    }
  };

  const handleDelete = async () => {
    const ids = [...selectedIds];

    await Promise.all(ids.map((id) => deleteMemberAPI(id)));

    dispatch(deleteMembers(ids));

    setSelectedIds([]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isSelectionMode ? `${selectedIds.length} selected` : "Members",

      headerRight: () =>
        isSelectionMode && hasMembers ? (
          <TouchableOpacity onPress={handleDelete}>
            <Icon name="trash-outline" color={Colors.danger} size={22} />
          </TouchableOpacity>
        ) : null,
    });
  }, [selectedIds]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <ScreenContainer>
      {/* <Button
        title="Add Member"
        leftIcon="add"
        onPress={() =>
          setShowModal(true)
        }
        style={{
          marginHorizontal:
            Spacing.lg,
          marginTop: Spacing.lg,
          marginBottom:
            Spacing.md,
        }}
      /> */}
      {members.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: Spacing.xl,
          }}
        >
          <Icon name="people-outline" size={64} color={Colors.textMuted} />

          <Text
            variant="h3"
            align="center"
            style={{
              marginTop: Spacing.lg,
            }}
          >
            No Members Yet
          </Text>

          <Text
            variant="body"
            color={Colors.textSecondary}
            align="center"
            style={{
              marginTop: Spacing.sm,
            }}
          >
            Add your first member to start managing your turf group.
          </Text>
        </View>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            paddingBottom: 220,
          }}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: Spacing.md,
              }}
            />
          )}
          renderItem={({ item }) => {
            const isSelected = selectedIds.includes(item.id);

            const statusLabel =
              item.membershipType === "GUEST"
                ? "Guest"
                : item.status === "APPROVED"
                ? "Member"
                : "Awaiting Approval";

            const statusColor =
              item.membershipType === "GUEST"
                ? Colors.textSecondary
                : item.status === "APPROVED"
                ? Colors.success
                : Colors.warning;

            return (
              <Card
                style={{
                  borderWidth: 1,
                  borderColor: isSelected ? Colors.primary : Colors.border,

                  backgroundColor: Colors.surface,

                  ...Shadows.sm,
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleSelect(item.id)}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {/* Avatar */}

                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 26,

                        backgroundColor: Colors.surfaceSecondary,

                        justifyContent: "center",

                        alignItems: "center",

                        marginRight: Spacing.md,
                      }}
                    >
                      <Text
                        variant="subtitle"
                        weight="700"
                        color={Colors.primary}
                      >
                        {(item.firstName?.[0] || "").toUpperCase()}
                        {(item.lastName?.[0] || "").toUpperCase()}
                      </Text>
                    </View>

                    {/* Name */}

                    <View
                      style={{
                        flex: 1,
                      }}
                    >
                      <Text variant="subtitle" weight="700">
                        {item.firstName} {item.lastName}
                      </Text>

                      <View
                        style={{
                          marginTop: Spacing.sm,

                          alignSelf: "flex-start",

                          paddingHorizontal: 10,

                          paddingVertical: 4,

                          borderRadius: Radius.full,

                          backgroundColor: statusColor,
                        }}
                      >
                        <Text variant="caption" weight="600" color="#fff">
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    {/* Selected */}

                    {isSelected && (
                      <Icon
                        name="checkmark-circle"
                        color={Colors.primary}
                        size={26}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              </Card>
            );
          }}
        />
      )}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowModal(true)}
        style={{
          position: "absolute",
          right: Spacing.xl,
          bottom: Layout.bottomTabHeight + Spacing.lg,

          width: 68,
          height: 68,
          borderRadius: 34,

          backgroundColor: Colors.primary,

          borderWidth: 2,
          borderColor: "rgba(255,255,255,0.12)",

          justifyContent: "center",
          alignItems: "center",

          ...Shadows.lg,
        }}
      >
        <Icon name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* ---------- Add Member Modal ---------- */}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: Spacing.xl,
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        >
          <Card
            style={{
              width: "100%",
              maxWidth: 420,
              ...Shadows.lg,
            }}
          >
            <Text variant="h3" align="center" weight="700">
              Add Member
            </Text>

            <Text
              variant="bodySmall"
              color={Colors.textSecondary}
              align="center"
              style={{
                marginTop: Spacing.sm,
                marginBottom: Spacing.xl,
              }}
            >
              Enter the member details below.
            </Text>

            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              leftIcon="person-outline"
            />

            <Input
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              leftIcon="person-outline"
            />

            <Button
              title="Add Member"
              leftIcon="add-circle-outline"
              onPress={handleAdd}
              fullWidth
              style={{
                marginTop: Spacing.lg,
              }}
            />

            <Button
              title="Cancel"
              variant="ghost"
              onPress={() => {
                setShowModal(false);
                setFirstName("");
                setLastName("");
              }}
              fullWidth
              style={{
                marginTop: Spacing.md,
              }}
            />
          </Card>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
