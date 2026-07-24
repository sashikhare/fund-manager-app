import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { signupAPI } from "../../api/authApi";

import {
  AnimatedBackground,
  Button,
  Card,
  Input,
  ScreenContainer,
  Text,
} from "../../components";

import { Colors, Radius, Spacing } from "../../theme";

export default function SignupScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [groupId, setGroupId] = useState("");
  const [joinType, setJoinType] = useState("GUEST");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !email || !password) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedBackground>
      <ScreenContainer>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {/* <Brand subtitle="Create your account" /> */}

            <Card style={styles.card}>
              <View style={styles.nameRow}>
                <View style={styles.half}>
                  <Input
                    label="First Name"
                    placeholder="First name"
                    value={firstName}
                    onChangeText={setFirstName}
                    // leftIcon="person-outline"
                    containerStyle={styles.input}
                    required
                  />
                </View>

                <View style={styles.half}>
                  <Input
                    label="Last Name"
                    placeholder="Last name"
                    value={lastName}
                    onChangeText={setLastName}
                    // leftIcon="person-outline"
                    containerStyle={styles.input}
                    required
                  />
                </View>
              </View>

              <Input
                label="Email Address"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                // leftIcon="mail-outline"
                containerStyle={styles.input}
                required
              />

              <Input
                label="Password"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                password
                // leftIcon="lock-closed-outline"
                containerStyle={styles.input}
                required
              />

              <Input
                label="Group Code"
                helperText="Optional"
                placeholder="Group code"
                value={groupId}
                onChangeText={setGroupId}
                leftIcon="people-outline"
                containerStyle={styles.input}
                optional
              />

              <Text variant="subtitle" weight="600" style={styles.joinTitle}>
                Join As
              </Text>

              <View style={styles.joinContainer}>
                <Pressable
                  onPress={() => setJoinType("MEMBER")}
                  style={[
                    styles.joinCard,
                    joinType === "MEMBER" && styles.joinCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      joinType === "MEMBER" && styles.radioOuterActive,
                    ]}
                  >
                    {joinType === "MEMBER" && (
                      <View style={styles.radioInner} />
                    )}
                  </View>

                  <Text variant="body" weight="600">
                    Member
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setJoinType("GUEST")}
                  style={[
                    styles.joinCard,
                    joinType === "GUEST" && styles.joinCardActive,
                  ]}
                >
                  <View
                    style={[
                      styles.radioOuter,
                      joinType === "GUEST" && styles.radioOuterActive,
                    ]}
                  >
                    {joinType === "GUEST" && <View style={styles.radioInner} />}
                  </View>

                  <Text variant="body" weight="600">
                    Guest
                  </Text>
                </Pressable>
              </View>

              <Button
                title="Create Account"
                leftIcon="person-add-outline"
                loading={loading}
                onPress={handleSignup}
                style={styles.signupButton}
              />
            </Card>

            <View style={styles.footer}>
              <Text variant="body" align="center">
                Already have an account?
              </Text>

              <Button
                title="Login"
                variant="ghost"
                onPress={() => navigation.navigate("Login")}
                textStyle={{
                  textDecorationLine: "underline",
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },

  card: {
    marginTop: Spacing.xl,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },

  half: {
    flex: 1,
  },

  input: {
    marginBottom: Spacing.lg,
  },

  joinTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },

  joinContainer: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  joinCard: {
    flex: 1,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingVertical: Spacing.lg,

    borderRadius: Radius.lg,

    borderWidth: 1,

    borderColor: Colors.border,

    backgroundColor: Colors.surfaceElevated,
  },

  joinCardActive: {
    borderColor: Colors.primary,

    backgroundColor: Colors.surfaceGlass,
  },

  radioOuter: {
    width: 20,

    height: 20,

    borderRadius: 10,

    borderWidth: 2,

    borderColor: Colors.border,

    justifyContent: "center",

    alignItems: "center",

    marginRight: Spacing.sm,
  },

  radioOuterActive: {
    borderColor: Colors.primary,
  },

  radioInner: {
    width: 10,

    height: 10,

    borderRadius: 5,

    backgroundColor: Colors.primary,
  },

  signupButton: {
    marginTop: Spacing.sm,
  },

  footer: {
    alignItems: "center",

    marginTop: Spacing.xl,

    paddingBottom: Spacing.lg,
  },
});
