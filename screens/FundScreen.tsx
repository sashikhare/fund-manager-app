import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  View
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { subscribeFund, updateFundAPI } from "../api/fundApi";
import {
  AnimatedBackground,
  Button,
  Card,
  Icon,
  Input,
  ScreenContainer,
  Text,
} from "../components";
import { setFundData } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { Colors, Radius, Shadows, Spacing } from "../theme";

export default function FundScreen() {
  const dispatch = useDispatch();

  const fund = useSelector((state: RootState) => state.app.fund);

  const transactions = useSelector(
    (state: RootState) => state.app.transactions
  );

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  const currentUser = useSelector((state: RootState) => state.app.currentUser);

  const [showModal, setShowModal] = useState(false);
  const [showSetModal, setShowSetModal] = useState(false);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const unsubscribe = subscribeFund(selectedGroup.id, (data) => {
      dispatch(setFundData(data));
    });

    return unsubscribe;
  }, [selectedGroup]);

  const handleSpend = async () => {
    const value = Number(amount);
    if (isNaN(value)) {
      setError("Please enter a valid numeric amount.");
      return;
    }

    if (!title || !amount) {
      setError("All fields are required");
      return;
    }

    if (value > fund) {
      setError("Not enough balance");
      return;
    }
    
    const updatedFund = fund - value;

    const newTransaction = {
      id: Date.now().toString(),
      type: "SPEND",
      title,
      amount: value,
      date: new Date().toISOString(),
    };

    await updateFundAPI(selectedGroup?.id, {
      fund: updatedFund,
      transactions: [newTransaction, ...transactions],
    });

    setTitle("");
    setAmount("");
    setError("");
    setShowModal(false);
  };

  return (
    <AnimatedBackground>
      <ScreenContainer>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Balance Card */}

          <Card variant="elevated" style={styles.balanceCard}>
            <Text
              variant="bodySmall"
              color={Colors.textSecondary}
              align="center"
            >
              Available Balance
            </Text>

            <Text
              variant="h1"
              weight="700"
              align="center"
              style={styles.balanceAmount}
            >
              ₹{Number(fund).toLocaleString()}
            </Text>

            <Text variant="caption" color={Colors.success} align="center">
              Current Fund
            </Text>
          </Card>

          {/* Admin Actions */}

          {currentUser?.role === "ADMIN" && (
            <View style={styles.actionRow}>
              <Button
                title="Set Balance"
                variant="secondary"
                leftIcon="wallet-outline"
                style={styles.actionButton}
                onPress={() => {
                  setError("");
                  setShowSetModal(true);
                }}
              />

              <Button
                title="Spend"
                variant="danger"
                leftIcon="card-outline"
                style={styles.actionButton}
                onPress={() => {
                  setError("");
                  setShowModal(true);
                }}
              />
            </View>
          )}

          {/* Transactions */}

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Card style={styles.emptyCard}>
                <Icon
                  name="receipt-outline"
                  size={56}
                  color={Colors.textMuted}
                />

                <Text
                  variant="subtitle"
                  weight="600"
                  align="center"
                  style={styles.emptyTitle}
                >
                  No Transactions
                </Text>

                <Text
                  variant="bodySmall"
                  align="center"
                  color={Colors.textSecondary}
                >
                  Fund history will appear here.
                </Text>
              </Card>
            }
            renderItem={({ item }) => {
              const isPositive =
                ["ADD", "EVENT"].includes(item.type) && item.amount > 0;

              const amountColor = isPositive ? Colors.success : Colors.danger;

              const icon =
                item.type === "SPEND"
                  ? "card-outline"
                  : item.type === "EVENT"
                  ? "football-outline"
                  : "wallet-outline";

              return (
                <Card style={styles.transactionCard}>
                  <View style={styles.transactionRow}>
                    <View style={styles.transactionLeft}>
                      <Icon name={icon} color={amountColor} />

                      <View>
                        <Text variant="body" weight="600">
                          {item.title}
                        </Text>

                        <Text variant="caption" color={Colors.textSecondary}>
                          {new Date(item.date).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>

                    <Text variant="subtitle" weight="700" color={amountColor}>
                      {isPositive ? "+" : "-"}₹{Math.abs(item.amount)}
                    </Text>
                  </View>
                </Card>
              );
            }}
          />
          <Modal
            visible={showSetModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowSetModal(false)}
          >
            <View style={styles.modalOverlay}>
              <Card style={styles.modalCard}>
                <Text variant="h3" weight="700" align="center">
                  Set Balance
                </Text>

                <Text
                  variant="bodySmall"
                  color={Colors.textSecondary}
                  align="center"
                  style={styles.modalSubtitle}
                >
                  Update the current fund balance.
                </Text>

                <Input
                  label="Current Balance"
                  value={balance}
                  onChangeText={setBalance}
                  keyboardType="numeric"
                  leftIcon="wallet-outline"
                />

                {!!error && (
                  <Text
                    variant="caption"
                    color={Colors.danger}
                    style={styles.error}
                  >
                    {error}
                  </Text>
                )}

                <Button
                  title="Confirm"
                  onPress={async () => {
                    const value = Number(balance);

                    if (!balance || value < 0) {
                      setError("Enter valid amount");
                      return;
                    }

                    await updateFundAPI(selectedGroup?.id, {
                      fund: value,
                      transactions: [
                        {
                          id: Date.now().toString(),
                          type: "ADD",
                          title: "Manual balance set",
                          amount: value,
                          date: new Date().toISOString(),
                        },
                        ...transactions,
                      ],
                    });
                    setBalance("");
                    setError("");
                    setShowSetModal(false);
                  }}
                />

                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={() => {
                    setError("");
                    setShowSetModal(false);
                  }}
                  style={styles.cancelButton}
                />
              </Card>
            </View>
          </Modal>

          {/* ---------- Spend Modal ---------- */}

          <Modal
            visible={showModal}
            transparent
            animationType="fade"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalOverlay}>
              <Card style={styles.modalCard}>
                <Text variant="h3" weight="700" align="center">
                  Add Spending
                </Text>

                <Text
                  variant="bodySmall"
                  color={Colors.textSecondary}
                  align="center"
                  style={styles.modalSubtitle}
                >
                  Record a new expense from the fund.
                </Text>

                <Input
                  label="Spending On"
                  value={title}
                  onChangeText={setTitle}
                  leftIcon="document-text-outline"
                />

                <Input
                  label="Amount"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  leftIcon="cash-outline"
                  placeholder="Enter amount"
                />

                {!!error && (
                  <Text
                    variant="caption"
                    color={Colors.danger}
                    style={styles.error}
                  >
                    {error}
                  </Text>
                )}

                <Button
                  title="Confirm"
                  variant="danger"
                  onPress={handleSpend}
                />

                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={() => {
                    setError("");
                    setShowModal(false);
                  }}
                  style={styles.cancelButton}
                />
              </Card>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </ScreenContainer>
    </AnimatedBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
  },

  balanceCard: {
    marginBottom: Spacing.xl,
    alignItems: "center",
    ...Shadows.md,
  },

  balanceAmount: {
    marginVertical: Spacing.sm,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },

  actionButton: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 120,
  },

  emptyCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.xxxl,
    marginTop: Spacing.xxl,
  },

  emptyTitle: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  transactionCard: {
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    borderRadius: Radius.xl,
    ...Shadows.lg,
  },

  modalSubtitle: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
  },

  error: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },

  cancelButton: {
    marginTop: Spacing.md,
  },
});
