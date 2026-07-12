import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import {
  settleEventAPI,
  subscribeEventsByGroupAPI,
  updateEventMemberAPI,
} from "../api/eventAPI";

import { updateFundAPI } from "../api/fundApi";

import {
  Button,
  Card,
  Icon,
  Input,
  ScreenContainer,
  Text,
} from "../components";

import {
  setEvents,
} from "../redux/appSlice";

import { RootState } from "../redux/store";

import {
  Colors,
  Spacing,
} from "../theme";

export default function EventListTab() {
  const dispatch = useDispatch();

  const events = useSelector(
    (state: RootState) => state.app.events
  );

  const members = useSelector(
    (state: RootState) => state.app.members
  );

  const fund = useSelector(
    (state: RootState) => state.app.fund
  );

  const transactions = useSelector(
    (state: RootState) => state.app.transactions
  );

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const [localAmounts, setLocalAmounts] =
    useState<Record<string, string>>({});

  const [selectedEventId, setSelectedEventId] =
    useState<string | null>(null);

  const selectedEvent = events.find(
    (e) => e.id === selectedEventId
  );

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const unsubscribe =
      subscribeEventsByGroupAPI(
        selectedGroup.id,
        (data) => {
          dispatch(setEvents(data));
        }
      );

    return unsubscribe;
  }, [selectedGroup]);

  const handleSettle = async () => {
    if (!selectedEvent) return;

    const totalCollected =
      selectedEvent.members.reduce(
        (sum, m) =>
          sum +
          (m.paid > 0
            ? m.paid
            : m.fee || 0),
        0
      );

    for (const member of selectedEvent.members) {
      const amount = Number(
        localAmounts[
          member.memberId
        ] ??
          member.fee ??
          0
      );

      await updateEventMemberAPI(
        selectedEvent.id,
        member.memberId,
        amount
      );
    }

    const remaining =
      totalCollected -
      selectedEvent.turfBookingAmount;

    await settleEventAPI(
      selectedEvent.id
    );

    const updatedFund =
      fund + remaining;

    const newTransaction = {
      id: Date.now().toString(),
      type: "EVENT",
      title: `${selectedEvent.name} settlement`,
      amount: remaining,
      date: new Date().toISOString(),
    };

    await updateFundAPI(
      selectedGroup?.id,
      {
        fund: updatedFund,
        transactions: [
          newTransaction,
          ...transactions,
        ],
      }
    );

    setSelectedEventId(null);
  };
    // 📄 EVENT DETAIL
  if (selectedEvent) {
    const totalCollected = selectedEvent.members.reduce(
      (sum: number, m: any) =>
        sum + (m.paid > 0 ? m.paid : m.fee || 0),
      0
    );

    const remaining =
      totalCollected -
      selectedEvent.turfBookingAmount;

    return (
      <ScreenContainer>
        <FlatList
          data={selectedEvent.members}
          keyExtractor={(item) => item.memberId}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: Spacing.xl,
            paddingBottom: 120,
          }}
          ListHeaderComponent={
            <Card
              style={{
                marginBottom: Spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="h3">
                    {selectedEvent.name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: Spacing.sm,
                    }}
                  >
                    <Icon
                      name="calendar-outline"
                      size={16}
                      color={Colors.textSecondary}
                    />

                    <Text
                      variant="bodySmall"
                      color={Colors.textSecondary}
                      style={{
                        marginLeft: Spacing.xs,
                      }}
                    >
                      {new Date(
                        selectedEvent.date
                      ).toDateString()}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 999,
                    backgroundColor:
                      selectedEvent.isSettled
                        ? "#143D26"
                        : "#4A3205",
                  }}
                >
                  <Text
                    variant="caption"
                    weight="700"
                    color={
                      selectedEvent.isSettled
                        ? "#32D583"
                        : "#FDB022"
                    }
                  >
                    {selectedEvent.isSettled
                      ? "Settled"
                      : "Pending"}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: Spacing.xl,
                }}
              >
                <View>
                  <Text
                    variant="caption"
                    color={Colors.textSecondary}
                  >
                    Turf Cost
                  </Text>

                  <Text
                    variant="subtitle"
                    weight="700"
                  >
                    ₹
                    {
                      selectedEvent.turfBookingAmount
                    }
                  </Text>
                </View>

                <View>
                  <Text
                    variant="caption"
                    color={Colors.textSecondary}
                  >
                    Members
                  </Text>

                  <Text
                    variant="subtitle"
                    weight="700"
                  >
                    {
                      selectedEvent.members
                        .length
                    }
                  </Text>
                </View>

                <View>
                  <Text
                    variant="caption"
                    color={Colors.textSecondary}
                  >
                    Collected
                  </Text>

                  <Text
                    variant="subtitle"
                    weight="700"
                  >
                    ₹{totalCollected}
                  </Text>
                </View>
              </View>
            </Card>
          }
          renderItem={({ item }) => {
            const amount =
              localAmounts[item.memberId] ??
              String(
                item.paid ||
                  item.fee ||
                  0
              );

            return (
              <Card
                style={{
                  marginBottom: Spacing.md,
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
                      width: 48,
                      height: 48,
                      borderRadius: 24,
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
                      weight="700"
                      color={
                        Colors.primary
                      }
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
                      Contribution
                    </Text>
                  </View>

                  {selectedEvent.isSettled ? (
                    <View
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 999,
                        backgroundColor:
                          "#143D26",
                      }}
                    >
                      <Text
                        variant="bodySmall"
                        weight="700"
                        color="#32D583"
                      >
                        ₹
                        {item.paid !==
                        item.fee
                          ? item.paid
                          : item.fee ||
                            0}
                      </Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        width: 120,
                      }}
                    >
                      <Input
                        value={amount}
                        keyboardType="numeric"
                        leftIcon="cash-outline"
                        onChangeText={(
                          val
                        ) =>
                          setLocalAmounts(
                            (
                              prev
                            ) => ({
                              ...prev,
                              [item.memberId]:
                                val,
                            })
                          )
                        }
                        onBlur={() =>
                          updateEventMemberAPI(
                            selectedEvent.id,
                            item.memberId,
                            Number(
                              localAmounts[
                                item
                                  .memberId
                              ] ??
                                item.fee ??
                                0
                            )
                          )
                        }
                      />
                    </View>
                  )}
                </View>
              </Card>
            );
          }}
                  ListFooterComponent={
          <>
            {/* Summary */}

            <Card
              style={{
                marginTop: Spacing.lg,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: Spacing.md,
                }}
              >
                <Text
                  variant="body"
                  color={Colors.textSecondary}
                >
                  Total Collected
                </Text>

                <Text
                  variant="subtitle"
                  weight="700"
                >
                  ₹{totalCollected}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  variant="body"
                  color={Colors.textSecondary}
                >
                  Remaining
                </Text>

                <Text
                  variant="subtitle"
                  weight="700"
                  color={
                    remaining >= 0
                      ? Colors.success
                      : Colors.danger
                  }
                >
                  ₹{remaining}
                </Text>
              </View>
            </Card>

            {!selectedEvent.isSettled && (
              <Button
                title="Settle Event"
                leftIcon="checkmark-circle-outline"
                fullWidth
                onPress={handleSettle}
                style={{
                  marginTop: Spacing.xl,
                }}
              />
            )}

            <Button
              title="Back to Events"
              variant="ghost"
              leftIcon="arrow-back-outline"
              fullWidth
              onPress={() =>
                setSelectedEventId(null)
              }
              style={{
                marginTop: Spacing.md,
              }}
            />
          </>
        }
      />
    </ScreenContainer>
  );
}

//
// 📋 EVENT LIST
//

return (
  <ScreenContainer>
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: Spacing.xl,
        paddingBottom: 120,
        flexGrow:
          events.length === 0
            ? 1
            : undefined,
      }}
      ItemSeparatorComponent={() => (
        <View
          style={{
            height: Spacing.md,
          }}
        />
      )}
      ListEmptyComponent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal:
              Spacing.xl,
          }}
        >
          <Icon
            name="football-outline"
            size={64}
            color={Colors.textMuted}
          />

          <Text
            variant="h3"
            align="center"
            style={{
              marginTop: Spacing.lg,
            }}
          >
            No Events Yet
          </Text>

          <Text
            variant="body"
            align="center"
            color={
              Colors.textSecondary
            }
            style={{
              marginTop: Spacing.sm,
            }}
          >
            Create your first event
            to start tracking
            payments.
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const totalCollected =
          item.members.reduce(
            (sum: number, m: any) =>
              sum + (m.paid || 0),
            0
          );

        return (
          <Card
            onPress={() =>
              setSelectedEventId(
                item.id
              )
            }
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{ flex: 1 }}
              >
                <Text
                  variant="subtitle"
                  weight="700"
                >
                  {item.name}
                </Text>

                <Text
                  variant="caption"
                  color={
                    Colors.textSecondary
                  }
                  style={{
                    marginTop: 4,
                  }}
                >
                  {new Date(
                    item.date
                  ).toDateString()}
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor:
                    item.isSettled
                      ? "#143D26"
                      : "#4A3205",
                }}
              >
                <Text
                  variant="caption"
                  weight="700"
                  color={
                    item.isSettled
                      ? "#32D583"
                      : "#FDB022"
                  }
                >
                  {item.isSettled
                    ? "Settled"
                    : "Pending"}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                marginTop:
                  Spacing.lg,
              }}
            >
              <View>
                <Text
                  variant="caption"
                  color={
                    Colors.textSecondary
                  }
                >
                  Members
                </Text>

                <Text
                  variant="subtitle"
                  weight="700"
                >
                  {
                    item.members
                      .length
                  }
                </Text>
              </View>

              <View>
                <Text
                  variant="caption"
                  color={
                    Colors.textSecondary
                  }
                >
                  Turf
                </Text>

                <Text
                  variant="subtitle"
                  weight="700"
                >
                  ₹
                  {
                    item.turfBookingAmount
                  }
                </Text>
              </View>

              <View>
                <Text
                  variant="caption"
                  color={
                    Colors.textSecondary
                  }
                >
                  Collected
                </Text>

                <Text
                  variant="subtitle"
                  weight="700"
                >
                  ₹
                  {totalCollected}
                </Text>
              </View>
            </View>
          </Card>
        );
      }}
    />
  </ScreenContainer>
);
}