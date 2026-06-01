import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { createAdminAPI, deleteAdminAPI, getAdminsAPI } from "../api/adminApi";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function SuperAdminScreen() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const navigation = useNavigation();

  const currentUser = useSelector((state: RootState) => state.app.currentUser);
  const SUPER_ADMIN_EMAIL = "sagar@email.com";
  const SUPER_ADMIN_PASSWORD = "123456";

  const toggleSelect = (id: string) => {
    setSelectedIds((prev = []) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    await Promise.all(selectedIds.map((id) => deleteAdminAPI(id)));

    setSelectedIds([]);
    loadAdmins(); // refresh
  };

  const loadAdmins = async () => {
    const data = await getAdminsAPI();
    setAdmins(data);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        selectedIds.length > 0 && (
          <Pressable onPress={handleDelete} style={{ marginRight: 10 }}>
            <Text style={{ color: "red" }}>Delete</Text>
          </Pressable>
        ),
    });
  }, [selectedIds]);

  const handleCreate = async () => {
    await createAdminAPI(
      email,
      password,
      {
        firstName,
        lastName,
        mobile,
      },
      //   currentUser.email,
      //   currentUser.password
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD
    );

    setShowForm(false);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMobile("");

    loadAdmins(); // refresh list
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Pressable style={styles.primaryBtn} onPress={() => setShowForm(true)}>
        <Text style={styles.primaryBtnText}>Create Admin</Text>
      </Pressable>

      {showForm && (
        <View style={{ marginVertical: 20 }}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Mobile"
            value={mobile}
            onChangeText={setMobile}
            style={styles.modalInput}
          />

          <Pressable style={styles.modalBtn} onPress={handleCreate}>
            <Text style={styles.modalBtnText}>Save</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={admins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedIds?.includes(item.id);
          return (
            <Pressable
              onPress={() => toggleSelect(item.id)}
              style={[
                styles.memberCard,
                isSelected && { backgroundColor: "#a19696" },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  {/* 👤 NAME */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <Ionicons
                      name="person-outline"
                      size={16}
                      color="#aaa"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.memberName}>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 2,
                    }}
                  >
                    <Ionicons
                      name="mail-outline"
                      size={14}
                      color="#aaa"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: "#aaa" }}>{item.email}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="call-outline"
                      size={14}
                      color="#aaa"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: "#aaa" }}>
                      {item.mobile || "No mobile"}
                    </Text>
                  </View>
                </View>

                <Text>{isSelected ? "✔️" : ""}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </View>
  );
}
