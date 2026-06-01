import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { createGroupAPI } from "../api/groupApi";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function CreateGroupScreen() {
  const user = useSelector((state: RootState) => state.app.currentUser);

  const [name, setName] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [memberFee, setMemberFee] = useState("");
  const [guestFee, setGuestFee] = useState("");
  const [noShowFee, setNoShowFee] = useState("");

  const handleCreate = async () => {
    const groupId = await createGroupAPI(
      {
        name,
        openingBalance: Number(openingBalance),
        memberFee: Number(memberFee),
        guestFee: Number(guestFee),
        noShowFee: Number(noShowFee),
      },
      user?.email
    );

    alert(`Group Created: ${groupId}`);
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Group Name" value={name} onChangeText={setName} style={styles.modalInput} />
      <TextInput placeholder="Opening Balance" value={openingBalance} onChangeText={setOpeningBalance} style={styles.modalInput} />
      <TextInput placeholder="Member Fee" value={memberFee} onChangeText={setMemberFee} style={styles.modalInput} />
      <TextInput placeholder="Guest Fee" value={guestFee} onChangeText={setGuestFee} style={styles.modalInput} />
      <TextInput placeholder="No Show Fee" value={noShowFee} onChangeText={setNoShowFee} style={styles.modalInput} />

      <Pressable style={styles.primaryBtn} onPress={handleCreate}>
        <Text style={styles.primaryBtnText}>Create Group</Text>
      </Pressable>
    </View>
  );
}