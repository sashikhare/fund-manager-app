import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import { loginAPI } from "../../api/authApi";
import { setUser } from "../../redux/appSlice";

import {
  AnimatedBackground,
  Brand,
  Button,
  Card,
  Input,
  ScreenContainer,
  Text,
} from "../../components";

import { Spacing } from "../../theme";

// import {
//   FadeInView,
//   SlideUpView,
// } from "../../components/Animated";

export default function LoginScreen({ navigation }: any) {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { userData } = await loginAPI(email, password);

      dispatch(setUser(userData));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <ScreenContainer>
        <View style={styles.container}>
          {/* <FadeInView> */}

          <View style={styles.brand}>
            <Brand />
          </View>

          {/* </FadeInView> */}

          {/* <SlideUpView> */}

          <Card style={styles.card}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              leftIcon="mail-outline"
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              containerStyle={styles.input}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              leftIcon="lock-closed-outline"
              password
              value={password}
              onChangeText={setPassword}
              containerStyle={styles.input}
            />

            <Button
              title="Login"
              loading={loading}
              leftIcon="log-in-outline"
              onPress={handleLogin}
              style={styles.button}
            />
          </Card>

          {/* </SlideUpView> */}

          <View style={styles.footer}>
            <Text variant="bodySmall" align="center">
              Don't have an account?
            </Text>

            <Button
              title="Create Account"
              variant="ghost"
              onPress={() => navigation.navigate("Signup")}
              textStyle={{
                textDecorationLine: "underline",
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  brand: {
    marginBottom: Spacing.section,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },

  input: {
    marginBottom: Spacing.xl,
  },

  button: {
    marginTop: Spacing.md,
  },

  footer: {
    marginTop: Spacing.xxl,
    alignItems: "center",
  },
});
