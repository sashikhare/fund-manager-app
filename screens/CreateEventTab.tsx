import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createEventAPI } from "../api/eventAPI";
import { getEligibleEventMembersAPI } from "../api/memberApi";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function CreateEventTab() {
  const dispatch = useDispatch();
  const members = useSelector((state: RootState) => state.app.members);
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [eventName, setEventName] = useState("");
  const [turfAmount, setTurfAmount] = useState("");
  const [eventDate, setEventDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    if (!selectedGroup?.id) return;
  
    const loadMembers = async () => {
      const data = await getEligibleEventMembersAPI(
        selectedGroup.id
      );
  
      setGroupMembers(data);
    };
  
    loadMembers();
  }, [selectedGroup]);
  

  const toggleMember = (id: string) => {
    setSelectedMembers(
      (prev) =>
        prev.includes(id)
          ? prev.filter((m) => m !== id) // remove
          : [...prev, id] // add
    );
  };

  const handleCreateEvent = async () => {
    
    if (
      !eventName ||
      !turfAmount ||
      !eventDate
      // selectedMembers.length === 0
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
      turfBookingAmount: Number(turfAmount),
      isSettled: false,
      groupId: selectedGroup?.id,
    };
  
    await createEventAPI(newEvent);
  
  
    alert("Event Created");

    if (Platform.OS === "android") {
      ToastAndroid.show("Event Created", ToastAndroid.SHORT);
    } else {
      Alert.alert("Success", "Event Created");
    }

    setEventName("");
    setTurfAmount("");
    setEventDate(null);
    setSelectedMembers([]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Create Event</Text>

      {/* Event Name */}
      <Text style={styles.label}>Event Name</Text>
      <TextInput
        placeholder="e.g. Turf Match"
        placeholderTextColor="#999"
        value={eventName}
        onChangeText={setEventName}
        style={styles.input}
      />

      {/* Turf Amount */}
      <Text style={styles.label}>Turf Booking Amount</Text>
      <TextInput
        placeholder="₹ 2000"
        placeholderTextColor="#999"
        value={turfAmount}
        onChangeText={setTurfAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      {/* Date */}
      <Text style={styles.label}>Event Date</Text>

      {Platform.OS === "web" ? (
        <input
          type="date"
          value={eventDate ? eventDate.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const selected = new Date(e.target.value);
            setEventDate(selected);
          }}
          style={{
            padding: 12,
            borderRadius: 8,
            border: "1px solid #ccc",
            marginTop: 10,
          }}
        />
      ) : (
        <>
          <Pressable
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: eventDate ? "#000" : "#999" }}>
              {eventDate ? eventDate.toDateString() : "Select Date"}
            </Text>
          </Pressable>

          {showDatePicker && (
            <DateTimePicker
              value={eventDate || new Date()}
              mode="date"
              onChange={(e, d) => {
                setShowDatePicker(false);
                if (d) setEventDate(d);
              }}
            />
          )}
        </>
      )}

      {/* Members */}
      <Text style={styles.label}>Members (Optional)</Text>
      <Pressable style={styles.input} onPress={() => setShowMemberModal(true)}>
        <Text style={{ color: "#000" }}>
          {selectedMembers.length > 0
            ? `${selectedMembers.length} members selected`
            : "Select Members"}
        </Text>
      </Pressable>

      <Modal visible={showMemberModal} transparent animationType="fade">
        <View style={styles.overlayBackground}>
          {/* Only THIS closes modal */}
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowMemberModal(false)}
          />

          {/* IMPORTANT: prevent click-through */}
          <Pressable style={styles.overlayCard}>
            {/* Header */}
            <View style={styles.overlayHeader}>
              <Text style={styles.overlayTitle}>Select Members</Text>

              <Pressable onPress={() => setShowMemberModal(false)}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            </View>
            <FlatList
              data={groupMembers}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => {
                const isSelected = selectedMembers.includes(item.id);

                return (
                  <Pressable
                    onPress={() => toggleMember(item.id)}
                    style={[
                      styles.overlayItem,
                      isSelected && styles.overlayItemSelected,
                    ]}
                  >
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={{ color: "#fff", fontSize: 15 }}>
                      {isSelected ? "✔️" : ""}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </View>
      </Modal>

      {/* Button */}
      <Pressable style={styles.primaryBtn} onPress={handleCreateEvent}>
        <Text style={styles.primaryBtnText}>Create Event</Text>
      </Pressable>
    </ScrollView>
  );
}
