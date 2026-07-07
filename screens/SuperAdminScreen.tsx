import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSelector } from "react-redux";

import {
  createAdminAPI,
  deleteAdminAPI,
  getAdminsAPI,
} from "../api/adminApi";

import {
  AnimatedBackground,
  Button,
  Card,
  Icon,
  Input,
  ScreenContainer,
  Text,
} from "../components";

import {
  Colors,
  Spacing
} from "../theme";

import { RootState } from "../redux/store";

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

  const currentUser = useSelector(
    (state: RootState) => state.app.currentUser
  );

  const SUPER_ADMIN_EMAIL = "sagar@email.com";
  const SUPER_ADMIN_PASSWORD = "123456";

  const toggleSelect = (id: string) => {
    setSelectedIds((prev = []) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    await Promise.all(
      selectedIds.map((id) => deleteAdminAPI(id))
    );

    setSelectedIds([]);

    loadAdmins();
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
          <Pressable
            onPress={handleDelete}
            style={styles.deleteBtn}
          >
            <Icon
              name="trash-outline"
              color={Colors.danger}
            />

            <Text
              color={Colors.danger}
              weight="600"
            >
              Delete
            </Text>
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
      SUPER_ADMIN_EMAIL,
      SUPER_ADMIN_PASSWORD
    );

    setShowForm(false);

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setMobile("");

    loadAdmins();
  };

  return (
    <AnimatedBackground>
      <ScreenContainer>

        <FlatList
          data={admins}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
          ListHeaderComponent={
            <>
              <Text
                variant="title"
                weight="700"
              >
                Administrators
              </Text>

              <Text
                color={Colors.textSecondary}
                style={styles.subtitle}
              >
                Manage administrator accounts
              </Text>

              <Button
                title="Create Administrator"
                leftIcon="person-add-outline"
                onPress={() => setShowForm(true)}
                style={styles.createButton}
              />

              {showForm && (
                <Card style={styles.formCard}>

                  <View style={styles.row}>

                    <View style={styles.half}>

                      <Input
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        leftIcon="person-outline"
                        containerStyle={styles.input}
                      />

                    </View>

                    <View style={styles.half}>

                      <Input
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        leftIcon="person-outline"
                        containerStyle={styles.input}
                      />

                    </View>

                  </View>

                  <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    leftIcon="mail-outline"
                    containerStyle={styles.input}
                  />

                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    password
                    leftIcon="lock-closed-outline"
                    containerStyle={styles.input}
                  />

                  <Input
                    label="Mobile"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    leftIcon="call-outline"
                    containerStyle={styles.input}
                  />

                  <Button
                    title="Save Administrator"
                    leftIcon="save-outline"
                    onPress={handleCreate}
                  />

                </Card>
              )}
            </>
          }
          renderItem={({ item }) => {
            const isSelected =
              selectedIds.includes(item.id);

            return (
              <Pressable
                onPress={() => toggleSelect(item.id)}
              >
                <Card
                  style={[
                    styles.adminCard,

                    isSelected &&
                      styles.adminCardSelected,
                  ]}
                >
                  <View style={styles.cardHeader}>

                    <View style={styles.nameRow}>

                      <Icon
                        name="person-circle-outline"
                        color={Colors.primary}
                      />

                      <Text
                        variant="headline"
                        weight="600"
                      >
                        {item.firstName}{" "}
                        {item.lastName}
                      </Text>

                    </View>

                    {isSelected && (
                      <Icon
                        name="checkmark-circle"
                        color={Colors.success}
                      />
                    )}

                  </View>

                  <View style={styles.infoRow}>
                    <Icon
                      name="mail-outline"
                      color={Colors.textSecondary}
                    />

                    <Text
                      color={Colors.textSecondary}
                    >
                      {item.email}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Icon
                      name="call-outline"
                      color={Colors.textSecondary}
                    />

                    <Text
                      color={Colors.textSecondary}
                    >
                      {item.mobile || "No mobile"}
                    </Text>
                  </View>

                </Card>
              </Pressable>
            );
          }}
        />

      </ScreenContainer>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xxxl,
  },

  subtitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xxl,
  },

  createButton: {
    marginBottom: Spacing.xl,
  },

  formCard: {
    marginBottom: Spacing.xxl,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  half: {
    flex: 1,
  },

  input: {
    marginBottom: Spacing.lg,
  },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginRight: Spacing.md,
  },

  adminCard: {
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  adminCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceGlass,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    flex: 1,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
});