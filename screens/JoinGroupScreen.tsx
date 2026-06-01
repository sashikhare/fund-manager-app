import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { joinGroupAPI } from "../api/groupApi";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function JoinGroupScreen() {
  const user = useSelector((state: RootState) => state.app.currentUser);

  const [groupId, setGroupId] = useState("");

  const handleJoin = async () => {
    try {
      await joinGroupAPI(groupId, user.uid);
      alert("Joined successfully");
      setGroupId("");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Enter Group ID"
        value={groupId}
        onChangeText={setGroupId}
        style={styles.modalInput}
      />

      <Pressable style={styles.primaryBtn} onPress={handleJoin}>
        <Text style={styles.primaryBtnText}>Join Group</Text>
      </Pressable>
    </View>
  );
}