import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from "react-native";

import { useSelector } from "react-redux";

import { createEventAPI } from "../api/eventAPI";
import { getEligibleEventMembersAPI } from "../api/memberApi";

import {
  Button,
  Card,
  Icon,
  Input,
  Text
} from "../components";

import { RootState } from "../redux/store";

import {
  Colors,
  Shadows,
  Spacing,
} from "../theme";

export default function CreateEventTab() {
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const [groupMembers, setGroupMembers] =
    useState<any[]>([]);

  const [eventName, setEventName] =
    useState("");

  const [turfAmount, setTurfAmount] =
    useState("");

  const [eventDate, setEventDate] =
    useState<Date | null>(null);

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [selectedMembers, setSelectedMembers] =
    useState<string[]>([]);

  const [showMemberModal, setShowMemberModal] =
    useState(false);

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const loadMembers = async () => {
      const data =
        await getEligibleEventMembersAPI(
          selectedGroup.id
        );

      setGroupMembers(data);
    };

    loadMembers();
  }, [selectedGroup]);

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((m) => m !== id)
        : [...prev, id]
    );
  };

  const handleCreateEvent = async () => {
    if (
      !eventName ||
      !turfAmount ||
      !eventDate
    ) {
      alert("Fill all fields");
      return;
    }

    if (!selectedGroup?.id) {
      alert("Please select a group first");
      return;
    }

    const newEvent = {
      name: eventName,
      date: eventDate.toISOString(),
      members: selectedMembers.map((id) => ({
        memberId: id,
        paid: 0,
      })),
      turfBookingAmount: Number(
        turfAmount
      ),
      isSettled: false,
      groupId: selectedGroup.id,
    };

    await createEventAPI(newEvent);

    if (Platform.OS === "android") {
      ToastAndroid.show(
        "Event Created",
        ToastAndroid.SHORT
      );
    } else {
      Alert.alert(
        "Success",
        "Event Created"
      );
    }

    setEventName("");
    setTurfAmount("");
    setEventDate(null);
    setSelectedMembers([]);
  };

  return (
    // <ScreenContainer>
    <>
    <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: Spacing.xl,
          paddingBottom: 140,
        }}
      >
        <Card
          style={{
            ...Shadows.sm,
          }}
        >
          <Input
            label="Event Name"
            value={eventName}
            onChangeText={setEventName}
            leftIcon="football-outline"
            placeholder="Weekly Turf Match"
          />

          <Input
            label="Turf Booking Amount"
            value={turfAmount}
            onChangeText={setTurfAmount}
            keyboardType="numeric"
            leftIcon="cash-outline"
            placeholder="₹2000"
          />

          <Text
            variant="label"
            style={{
              marginBottom:
                Spacing.sm,
            }}
          >
            Event Date
          </Text>

          {Platform.OS === "web" ? (
            <input
              type="date"
              value={
                eventDate
                  ? eventDate
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEventDate(
                  new Date(
                    e.target.value
                  )
                )
              }
              style={{
                padding: 14,
                borderRadius: 14,
                border:
                  "1px solid #2B3445",
                background:
                  "#181C24",
                color: "#fff",
                marginBottom: 20,
              }}
            />
          ) : (
            <>
              <Button
                title={
                  eventDate
                    ? eventDate.toDateString()
                    : "Select Event Date"
                }
                variant="outline"
                leftIcon="calendar-outline"
                onPress={() =>
                  setShowDatePicker(
                    true
                  )
                }
              />

              {showDatePicker && (
                <DateTimePicker
                  value={
                    eventDate ||
                    new Date()
                  }
                  mode="date"
                  onChange={(
                    e,
                    date
                  ) => {
                    setShowDatePicker(
                      false
                    );

                    if (date)
                      setEventDate(
                        date
                      );
                  }}
                />
              )}
            </>
          )}

          {/* <Button
            title={
              selectedMembers.length
                ? `${selectedMembers.length} Members Selected`
                : "Select Members"
            }
            variant="outline"
            leftIcon="people-outline"
            onPress={() =>
              setShowMemberModal(
                true
              )
            }
            style={{
              marginTop:
                Spacing.lg,
            }}
          /> */}
                {/* ---------------- Member Selection Modal ---------------- */}

      <Modal
        visible={showMemberModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: Spacing.xl,
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        >
          <Card
            style={{
              maxHeight: "75%",
              ...Shadows.lg,
            }}
          >
            {/* Header */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing.lg,
              }}
            >
              <Text variant="h3">
                Members
              </Text>

              <Button
                title="Done"
                variant="ghost"
                onPress={() =>
                  setShowMemberModal(false)
                }
              />
            </View>

            <FlatList
              data={groupMembers}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: Spacing.md,
                  }}
                />
              )}
              renderItem={({ item }) => {
                const isSelected =
                  selectedMembers.includes(
                    item.id
                  );

                return (
                  <Card
                    onPress={() =>
                      toggleMember(item.id)
                    }
                    style={{
                      backgroundColor:
                        Colors.surface,

                      borderWidth: isSelected
                        ? 2
                        : 1,

                      borderColor: isSelected
                        ? Colors.primary
                        : Colors.border,
                    }}
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
                          width: 46,
                          height: 46,
                          borderRadius: 23,

                          backgroundColor:
                            "#1A2234",

                          justifyContent:
                            "center",

                          alignItems:
                            "center",

                          marginRight:
                            Spacing.md,
                        }}
                      >
                        <Text
                          variant="subtitle"
                          color={
                            Colors.primary
                          }
                          weight="700"
                        >
                          {(
                            item.firstName?.[0] ||
                            ""
                          ).toUpperCase()}
                          {(
                            item.lastName?.[0] ||
                            ""
                          ).toUpperCase()}
                        </Text>
                      </View>

                      {/* Name */}

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text
                          variant="subtitle"
                          weight="700"
                        >
                          {item.firstName}{" "}
                          {item.lastName}
                        </Text>

                        <Text
                          variant="caption"
                          color={
                            Colors.textSecondary
                          }
                        >
                          {item.membershipType ===
                          "GUEST"
                            ? "Guest"
                            : "Member"}
                        </Text>
                      </View>

                      {/* Check */}

                      {isSelected && (
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,

                            backgroundColor:
                              Colors.primary,

                            justifyContent:
                              "center",

                            alignItems:
                              "center",
                          }}
                        >
                          <Icon
                            name="checkmark"
                            size={18}
                            color="#fff"
                          />
                        </View>
                      )}
                    </View>
                  </Card>
                );
              }}
            />
          </Card>
        </View>
      </Modal>
                <Button
            title="Create Event"
            leftIcon="football-outline"
            fullWidth
            onPress={handleCreateEvent}
            style={{
              marginTop: Spacing.xl,
            }}
          />
        </Card>
      </ScrollView>

      {/* ---------------- Member Selection Modal ---------------- */}

      <Modal
        visible={showMemberModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMemberModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            padding: Spacing.xl,
            backgroundColor: "rgba(0,0,0,0.65)",
          }}
        >
          <Card
            style={{
              maxHeight: "75%",
              ...Shadows.lg,
            }}
          >
            {/* Header */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: Spacing.lg,
              }}
            >
              <Text variant="h3">
                Select Members
              </Text>

              <Button
                title="Done"
                variant="ghost"
                onPress={() =>
                  setShowMemberModal(false)
                }
              />
            </View>

            <FlatList
              data={groupMembers}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View
                  style={{
                    height: Spacing.md,
                  }}
                />
              )}
              renderItem={({ item }) => {
                const isSelected =
                  selectedMembers.includes(item.id);

                return (
                  <Card
                    onPress={() =>
                      toggleMember(item.id)
                    }
                    style={{
                      backgroundColor:
                        Colors.surface,

                      borderWidth: isSelected
                        ? 2
                        : 1,

                      borderColor: isSelected
                        ? Colors.primary
                        : Colors.border,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 23,
                          backgroundColor: "#1A2234",
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
                          {(item.firstName?.[0] || "")
                            .toUpperCase()}
                          {(item.lastName?.[0] || "")
                            .toUpperCase()}
                        </Text>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text
                          variant="subtitle"
                          weight="700"
                        >
                          {item.firstName}{" "}
                          {item.lastName}
                        </Text>

                        <Text
                          variant="caption"
                          color={
                            Colors.textSecondary
                          }
                        >
                          {item.membershipType ===
                          "GUEST"
                            ? "Guest"
                            : "Member"}
                        </Text>
                      </View>

                      {isSelected && (
                        <View
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 17,
                            backgroundColor:
                              Colors.primary,
                            justifyContent:
                              "center",
                            alignItems:
                              "center",
                          }}
                        >
                          <Icon
                            name="checkmark"
                            size={18}
                            color="#fff"
                          />
                        </View>
                      )}
                    </View>
                  </Card>
                );
              }}
            />
          </Card>
        </View>
      </Modal>
      </KeyboardAvoidingView>
      </>
    // </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },

  content: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },

  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },

  input: {
    marginBottom: Spacing.lg,
  },
});