import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { useDispatch } from "react-redux";
import { loginAPI } from "../../api/authApi";
import { setUser } from "../../redux/appSlice";
import { styles } from "../../styles/mainStyles";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { userData } = await loginAPI(email, password);

      dispatch(setUser(userData));

    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Login</Text>

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

      <Pressable style={styles.modalBtn} onPress={handleLogin}>
        <Text style={styles.modalBtnText}>Login</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Signup")}>
  <Text style={{ marginTop: 10, textAlign: "center" }}>
    Don't have an account? Sign up
  </Text>
</Pressable>
    </View>
  );
}