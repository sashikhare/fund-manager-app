import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { subscribeFund, updateFundAPI } from "../api/fundApi";
import { setFundData } from "../redux/appSlice";
import { RootState } from "../redux/store";
import { styles } from "../styles/mainStyles";

export default function FundScreen() {
  const fund = useSelector((state: RootState) => state.app.fund);
  const transactions = useSelector(
    (state: RootState) => state.app.transactions
  );

  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [showSetModal, setShowSetModal] = useState(false);
  const [balance, setBalance] = useState("");
  // const [error, setError] = useState("");

  const selectedGroup = useSelector(
    (state: RootState) => state.app.selectedGroup
  );

  useEffect(() => {
    if (!selectedGroup?.id) return;
  
    const unsubscribe = subscribeFund(selectedGroup.id, (data) => {
      dispatch(setFundData(data));
    });
  
    return unsubscribe;
  }, [selectedGroup]);

  const handleSpend = async () => {
    const value = Number(amount);

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

    // 🔥 Update Firebase
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
    <View style={{ flex: 1 }}>
      {/* 💰 Fund Card */}
      <View style={styles.fundCard}>
        <Text style={styles.fundLabel}>Current Fund</Text>
        <Text style={styles.fundAmount}>₹{fund}</Text>
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => setShowSetModal(true)}
        >
          <Text style={styles.secondaryBtnText}>Set Balance</Text>
        </Pressable>
      </View>

      {/* ➖ Spend Button */}
      <Pressable
        style={styles.spendPrimaryBtn}
        onPress={() => setShowModal(true)}
      >
        <Text style={styles.spendPrimaryBtnText}>Spend</Text>
      </Pressable>

      {/* 📜 History */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.txCard}>
            <View>
              <Text style={styles.txTitle}>{item.title}</Text>
              <Text style={styles.txDate}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>

            <Text
              style={[
                styles.txAmount,
                // item.type === "ADD" ? { color: "green" } : { color: "red" },
                ["ADD", "EVENT"].includes(item.type)
                  ? item.amount > 0 ? { color: "green" } : { color: "red" }
                  : { color: "red" },
              ]}
            >
              {["ADD", "EVENT"].includes(item.type) ? item.amount > 0 ? "+" : "-" : "-"}₹{item.amount > 0 ? item.amount : item.amount * -1}
            </Text>
          </View>
        )}
      />

      {/* 🌑 Modal */}
      <Modal visible={showSetModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Set Balance</Text>

            <TextInput
              placeholder="Enter current balance"
              value={balance}
              onChangeText={setBalance}
              keyboardType="numeric"
              style={styles.modalInput}
              placeholderTextColor="#aaa"
            />

            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <Pressable
              style={styles.modalBtn}
              onPress={async () => {
                const value = Number(balance);

                if (!balance || value < 0) {
                  setError("Enter valid amount");
                  return;
                }
                await updateFundAPI(selectedGroup?.id,{
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

                // dispatch(setFund(value));

                setBalance("");
                setError("");
                setShowSetModal(false);
              }}
            >
              <Text style={styles.modalBtnText}>Confirm</Text>
            </Pressable>

            <Pressable onPress={() => setShowSetModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Spending</Text>

            <TextInput
              placeholder="Spending on"
              value={title}
              onChangeText={setTitle}
              style={styles.modalInput}
              placeholderTextColor="#aaa"
            />

            <TextInput
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              style={styles.modalInput}
              placeholderTextColor="#aaa"
            />

            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <Pressable style={styles.modalBtn} onPress={handleSpend}>
              <Text style={styles.modalBtnText}>Confirm</Text>
            </Pressable>

            <Pressable onPress={() => setShowModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
