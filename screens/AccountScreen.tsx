import React from "react";
import { Pressable, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { logoutAPI } from "../api/authApi";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function AccountScreen() {
  const user = useSelector((state: RootState) => state.app.currentUser);
  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const handleLogout = async () => {
    await logoutAPI();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* 👤 User Info */}
      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          {user?.firstName} {user?.lastName}
        </Text>

        <Text style={{ color: "#666", marginTop: 4 }}>Role: {user?.role}</Text>
      </View>
      <View style={styles.memberCard}>
        <Text style={styles.memberName}>Selected Group</Text>

        <Text style={{ color: "#aaa", marginTop: 4 }}>
          {selectedGroup?.name || "No group selected"}
        </Text>
      </View>

      {/* 🚪 Logout Button */}
      <Pressable style={styles.primaryBtn} onPress={handleLogout}>
        <Text style={styles.primaryBtnText}>Logout</Text>
      </Pressable>
    </View>
  );
}
