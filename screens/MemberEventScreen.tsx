import React, {
  useEffect,
  useState,
} from "react";

import {
  FlatList,
  View,
} from "react-native";

import { useSelector } from "react-redux";

import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { joinEventAPI } from "@/api/eventAPI";

import { db } from "../firebase/firebase";

import {
  Button,
  Card,
  Icon,
  ScreenContainer,
  Text,
} from "../components";

import { RootState } from "../redux/store";

import {
  Colors,
  Spacing,
} from "../theme";

export default function MemberEventScreen() {
  const [events, setEvents] =
    useState<any[]>([]);

  const currentUser =
    useSelector(
      (state: RootState) =>
        state.app.currentUser
    );

  const selectedGroup =
    useSelector(
      (state: RootState) =>
        state.app.selectedGroup
    );

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const q = query(
      collection(db, "events"),
      where(
        "groupId",
        "==",
        selectedGroup.id
      )
    );

    const unsubscribe =
      onSnapshot(q, (snapshot) => {
        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setEvents(data);
      });

    return unsubscribe;
  }, [selectedGroup]);

  const handleJoin =
    async (eventId: string) => {
      try {
        await joinEventAPI(
          eventId,
          currentUser?.uid,
          selectedGroup?.id
        );

        alert(
          "Joined Successfully"
        );
      } catch (e: any) {
        alert(e.message);
      }
    };

  return (
    <ScreenContainer>
      <FlatList
        data={events}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingHorizontal:
            Spacing.lg,
          paddingBottom: 120,
          flexGrow:
            events.length === 0
              ? 1
              : undefined,
        }}
                renderItem={({ item }) => {
          const joinedMember = item.members?.find(
            (m: any) =>
              m.memberId === currentUser?.uid
          );

          return (
            <Card
              style={{
                marginBottom: Spacing.lg,
              }}
            >
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
                  <Icon
                    name="football-outline"
                    size={26}
                    color={Colors.primary}
                  />
                </View>

                {/* Event */}

                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    variant="subtitle"
                    weight="700"
                  >
                    {item.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 2,
                    }}
                  >
                    <Icon
                      name="calendar-outline"
                      size={14}
                      color={Colors.textSecondary}
                    />

                    <Text
                      variant="caption"
                      color={
                        Colors.textSecondary
                      }
                      style={{
                        marginLeft: 4,
                      }}
                    >
                      {new Date(
                        item.date
                      ).toDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Divider */}

              <View
                style={{
                  height: 1,
                  backgroundColor:
                    Colors.border,
                  marginVertical:
                    Spacing.lg,
                }}
              />

              {/* Stats */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent:
                    "space-between",
                }}
              >
                {/* Turf */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="cash-outline"
                    size={18}
                    color={
                      Colors.primary
                    }
                  />

                  <Text
                    variant="h3"
                    weight="700"
                    style={{
                      marginTop: 6,
                    }}
                  >
                    ₹
                    {
                      item.turfBookingAmount
                    }
                  </Text>

                  <Text
                    variant="caption"
                    color={
                      Colors.textSecondary
                    }
                  >
                    Turf Cost
                  </Text>
                </View>

                {/* Joined */}

                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <Icon
                    name="people-outline"
                    size={18}
                    color={
                      Colors.success
                    }
                  />

                  <Text
                    variant="h3"
                    weight="700"
                    style={{
                      marginTop: 6,
                    }}
                  >
                    {
                      item.members
                        ?.length || 0
                    }
                  </Text>

                  <Text
                    variant="caption"
                    color={
                      Colors.textSecondary
                    }
                  >
                    Joined
                  </Text>
                </View>
              </View>

              {/* Divider */}

              <View
                style={{
                  height: 1,
                  backgroundColor:
                    Colors.border,
                  marginVertical:
                    Spacing.lg,
                }}
              />

              {/* Action */}

              {joinedMember ? (
                <View
                  style={{
                    alignItems:
                      "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection:
                        "row",
                      alignItems:
                        "center",
                      backgroundColor:
                        "#143D26",
                      paddingHorizontal: 18,
                      paddingVertical: 10,
                      borderRadius: 999,
                    }}
                  >
                    <Icon
                      name="checkmark-circle"
                      size={18}
                      color="#32D583"
                    />

                    <Text
                      variant="bodySmall"
                      weight="700"
                      color="#32D583"
                      style={{
                        marginLeft: 8,
                      }}
                    >
                      Joined as{" "}
                      {
                        joinedMember.membershipType
                      }
                    </Text>
                  </View>
                </View>
              ) : (
                <Button
                  title="Join Event"
                  leftIcon="log-in-outline"
                  fullWidth
                  onPress={() =>
                    handleJoin(item.id)
                  }
                />
              )}
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
              name="football-outline"
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
              No Events Available
            </Text>

            <Text
              variant="body"
              align="center"
              color={Colors.textSecondary}
              style={{
                marginTop: Spacing.sm,
              }}
            >
              There are no upcoming events
              for this group yet.
            </Text>

            <Text
              variant="caption"
              align="center"
              color={Colors.textMuted}
              style={{
                marginTop: Spacing.xs,
              }}
            >
              Ask your group admin to create
              a new event.
            </Text>
          </View>
        }
      />
    </ScreenContainer>
  );
}