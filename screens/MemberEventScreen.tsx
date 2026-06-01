import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { useSelector } from "react-redux";

import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

import { collection, onSnapshot, query, where } from "firebase/firestore";

import { joinEventAPI } from "@/api/eventAPI";
import { db } from "../firebase/firebase";

export default function MemberEventScreen() {
  const [events, setEvents] = useState<any[]>([]);

  const currentUser = useSelector((state: RootState) => state.app.currentUser);

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const q = query(
      collection(db, "events"),
      where("groupId", "==", selectedGroup?.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEvents(data);
    });

    return () => unsubscribe();
  }, [selectedGroup]);

  const handleJoin = async (eventId: string) => {
    try {
      await joinEventAPI(eventId, currentUser?.uid, selectedGroup?.id);

      alert("Joined Successfully");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View
            style={{
              marginTop: 100,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#999" }}>No Events Found</Text>
          </View>
        )}
        renderItem={({ item }) => {
          const joinedMember = item.members?.find(
            (m: any) => m.memberId === currentUser?.uid
          );
          return (
            <View style={styles.memberCard}>
              <Text style={styles.memberName}>{item.name}</Text>

              <Text
                style={{
                  color: "#999",
                  marginTop: 6,
                }}
              >
                Date: {new Date(item.date).toLocaleDateString()}
              </Text>

              <Text
                style={{
                  color: "#999",
                  marginTop: 4,
                }}
              >
                Turf Amount: ₹{item.turfBookingAmount}
              </Text>

              <Text
                style={{
                  color: "#999",
                  marginTop: 4,
                }}
              >
                Joined: {item.members?.length || 0}
              </Text>

              {joinedMember ? (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "green",
                    padding: 10,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff" }}>
                    Joined as {joinedMember.membershipType}
                  </Text>
                </View>
              ) : (
                <Pressable
                  style={styles.primaryBtn}
                  onPress={() => handleJoin(item.id)}
                >
                  <Text style={styles.primaryBtnText}>Join Event</Text>
                </Pressable>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}
