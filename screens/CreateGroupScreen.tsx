import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet
} from "react-native";
import { useSelector } from "react-redux";

import { createGroupAPI } from "../api/groupApi";
import {
  Button,
  Card,
  Input
} from "../components";
import { RootState } from "../redux/store";
import {
  Spacing,
} from "../theme";

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Card>
          <Input
            label="Group Name"
            placeholder="Enter group name"
            value={name}
            onChangeText={setName}
            leftIcon="people-outline"
            containerStyle={styles.input}
          />

          <Input
            label="Opening Balance"
            placeholder="Enter opening balance"
            value={openingBalance}
            onChangeText={setOpeningBalance}
            keyboardType="numeric"
            leftIcon="wallet-outline"
            containerStyle={styles.input}
          />

          <Input
            label="Member Fee"
            placeholder="Enter member fee"
            value={memberFee}
            onChangeText={setMemberFee}
            keyboardType="numeric"
            leftIcon="person-outline"
            containerStyle={styles.input}
          />

          <Input
            label="Guest Fee"
            placeholder="Enter guest fee"
            value={guestFee}
            onChangeText={setGuestFee}
            keyboardType="numeric"
            leftIcon="person-add-outline"
            containerStyle={styles.input}
          />

          <Input
            label="No Show Fee"
            placeholder="Enter no show fee"
            value={noShowFee}
            onChangeText={setNoShowFee}
            keyboardType="numeric"
            leftIcon="close-circle-outline"
            containerStyle={styles.input}
          />

          <Button
            title="Create Group"
            leftIcon="add-circle-outline"
            onPress={handleCreate}
          />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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