import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { signupAPI } from "../../api/authApi";
import { styles } from "../../styles/mainStyles";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [joinType, setJoinType] = useState("GUEST");

  const handleSignup = async () => {
    if (!firstName || !email || !password) {
      alert("Please fill required fields");
      return;
    }

    try {
      await signupAPI(
        email,
        password,
        {
          firstName,
          lastName,
        },
        groupId,
        joinType
      );

      alert("Signup successful");
    } catch (e: any) {
      alert(e.message);
    }
  };
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Signup</Text>

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
        secureTextEntry
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
        placeholder="Group ID (optional)"
        value={groupId}
        onChangeText={setGroupId}
        style={styles.modalInput}
      />

      <Text
        style={{
          color: "#fff",
          marginTop: 10,
          marginBottom: 10,
          fontWeight: "600",
        }}
      >
        Join As
      </Text>

      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        {/* MEMBER */}
        <Pressable
          onPress={() => setJoinType("MEMBER")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 20,
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            {joinType === "MEMBER" && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#007AFF",
                }}
              />
            )}
          </View>

          <Text style={{ color: "#fff" }}>Member</Text>
        </Pressable>

        {/* GUEST */}
        <Pressable
          onPress={() => setJoinType("GUEST")}
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              borderWidth: 2,
              borderColor: "#007AFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 8,
            }}
          >
            {joinType === "GUEST" && (
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#007AFF",
                }}
              />
            )}
          </View>

          <Text style={{ color: "#fff" }}>Guest</Text>
        </Pressable>
      </View>

      <Pressable style={styles.modalBtn} onPress={handleSignup}>
        <Text style={styles.modalBtnText}>Signup</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 10 }}>Already have account? Login</Text>
      </Pressable>
    </View>
  );
}
