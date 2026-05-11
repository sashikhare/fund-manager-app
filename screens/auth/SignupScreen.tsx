import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { signupAPI } from "../../api/authApi";
import { styles } from "../../styles/mainStyles";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSignup = async () => {
    try {
      await signupAPI(email, password, {
        firstName,
        lastName,
        role: "SUPER_ADMIN", // first user
        groupId: null,
      });

      alert("Signup successful");

      navigation.navigate("Login");
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

      <Pressable style={styles.modalBtn} onPress={handleSignup}>
        <Text style={styles.modalBtnText}>Signup</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Login")}>
        <Text style={{ marginTop: 10 }}>Already have account? Login</Text>
      </Pressable>
    </View>
  );
}