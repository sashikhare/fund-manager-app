import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  settleEventAPI,
  subscribeEventsByGroupAPI,
  updateEventMemberAPI
} from "../api/eventAPI";
import { updateFundAPI } from "../api/fundApi";
import { setEvents } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function EventListTab() {
  const dispatch = useDispatch();

  const events = useSelector((state: RootState) => state.app.events);
  const members = useSelector((state: RootState) => state.app.members);
  const fund = useSelector((state: RootState) => state.app.fund);
  const [localAmounts, setLocalAmounts] = useState<Record<string, string>>({});
  const transactions = useSelector(
    (state: RootState) => state.app.transactions
  );
  const groupId = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const selectedGroup = useSelector(
      (state: RootState) => state.app.selectedGroup
    );

  // const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  // useEffect(() => {
  //   if (!groupId) return;
  
  //   const load = async () => {
  //     const data = await getEventsByGroupAPI(groupId);
  //     dispatch(setEvents(data));
  //   };
  
  //   load();
  // }, [groupId]);

  useEffect(() => {
    if (!selectedGroup?.id) return;
  
    const unsubscribe =
      subscribeEventsByGroupAPI(
        selectedGroup.id,
        (data) => {
          dispatch(setEvents(data));
        }
      );
  
    return () => unsubscribe();
  }, [selectedGroup]);
  
  const handleSettle = async () => {
    if (!selectedEvent) return;

    const totalCollected = selectedEvent.members.reduce(
      (sum, m) => sum + (m.paid || 0),
      0
    );

    const remaining = totalCollected - selectedEvent.turfBookingAmount;

    await settleEventAPI(selectedEvent.id); // 🔥 server update

    // 🔥 Update Firebase first
    const updatedFund = fund + remaining;

    const newTransaction = {
      id: Date.now().toString(),
      type: "EVENT",
      title: `${selectedEvent.name} settlement`,
      amount: remaining,
      date: new Date().toISOString(),
    };
    await updateFundAPI(selectedGroup?.id, {
      fund: updatedFund,
      transactions: [newTransaction, ...transactions],
    });

    // setSelectedEvent(null);
  };

  // 📄 EVENT DETAIL
  if (selectedEvent) {
    const totalCollected = selectedEvent.members.reduce(
      (sum: number, m: any) => sum + (m.paid || 0),
      0
    );

    const remaining = totalCollected - selectedEvent.turfBookingAmount;

    return (
      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.eventMetaRow}>
          <View>
            <Text style={styles.eventDetailsHeading}>{selectedEvent.name}</Text>

            {/* Left: Date */}
            <Text style={styles.eventDate}>
              {new Date(selectedEvent.date).toDateString()}
            </Text>
          </View>

          {/* Right: Turf Cost */}
          <Text style={styles.turfCost}>
            Turf Cost ₹{selectedEvent.turfBookingAmount}
          </Text>
        </View>

        {/* Members */}
        <FlatList
          data={selectedEvent.members}
          keyExtractor={(item) => item.memberId}
          renderItem={({ item }) => {
            const member = members.find((m) => m.id === item.memberId);

            if (!member) return null;

            return (
              <View style={styles.memberRow}>
                <Text style={styles.memberName}>{member.firstName}</Text>

                {selectedEvent.isSettled ? (
                  <Text style={styles.amountText}>₹{item.paid || 0}</Text>
                ) : (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={styles.amountSymbol}>₹</Text>
                      {/* <TextInput
                        keyboardType="numeric"
                        placeholder="amt"
                        style={styles.inputSmall}
                        onChangeText={(val) =>
                          updateEventMemberAPI(
                            selectedEvent.id,
                            item.memberId,
                            Number(val)
                          )
                        }
                      /> */}
                      <TextInput
                        value={localAmounts[item.memberId] || ""}
                        onChangeText={(val) =>
                          setLocalAmounts((prev) => ({
                            ...prev,
                            [item.memberId]: val,
                          }))
                        }
                        onBlur={() =>
                          updateEventMemberAPI(
                            selectedEvent.id,
                            item.memberId,
                            Number(localAmounts[item.memberId] || 0)
                          )
                        }
                      />
                    </View>
                  </>
                )}
              </View>
            );
          }}
        />

        {/* Summary */}
        <Text style={styles.summary}>Collected: ₹{totalCollected}</Text>

        <Text style={styles.summary}>Remaining: ₹{remaining}</Text>

        {/* Settle Button */}
        {!selectedEvent.isSettled && (
          <Pressable style={styles.primaryBtn} onPress={handleSettle}>
            <Text style={styles.primaryBtnText}>Settle Event</Text>
          </Pressable>
        )}

        <Pressable onPress={() => setSelectedEventId(null)}>
          <Text style={{ textAlign: "center", marginTop: 10 }}>Back</Text>
        </Pressable>
      </View>
    );
  }

  // 📋 EVENT LIST
  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => {
        const totalCollected = item.members.reduce(
          (sum: number, m: any) => sum + (m.paid || 0),
          0
        );

        return (
          <Pressable
            style={styles.eventCard}
            onPress={() => setSelectedEventId(item.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.eventTitle}>{item.name}</Text>

              <View
                style={[
                  styles.statusBadge,
                  item.isSettled ? styles.badgeGreen : styles.badgeOrange,
                ]}
              >
                <Text style={styles.badgeText}>
                  {item.isSettled ? "Settled" : "Pending"}
                </Text>
              </View>
            </View>

            <Text style={styles.subText}>
              {new Date(item.date).toDateString()}
            </Text>

            <Text style={styles.infoText}>Members: {item.members.length}</Text>

            <Text style={styles.infoText}>Turf: ₹{item.turfBookingAmount}</Text>

            <Text style={styles.infoText}>Collected: ₹{totalCollected}</Text>
          </Pressable>
        );
      }}
    />
  );
}
