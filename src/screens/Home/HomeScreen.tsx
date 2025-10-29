import { useMemo } from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useLedger } from "@/state/LedgerProvider";
import { RootStackParamList, TabParamList } from "@/navigation/types";
import { formatCurrency } from "@/utils/format";
import { isWithinCurrentMonth } from "@/utils/datetime";

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "HomeTab">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { transactions, accounts, getAccountBalance } = useLedger();

  const monthlyTransactions = useMemo(
    () => transactions.filter((transaction) => isWithinCurrentMonth(transaction.occurredAt)),
    [transactions]
  );

  const { totalExpense, totalIncome } = useMemo(() => {
    const expense = monthlyTransactions
      .filter((item) => item.type === "expense")
      .reduce((sum, item) => sum + item.amount, 0);
    const income = monthlyTransactions
      .filter((item) => item.type === "income")
      .reduce((sum, item) => sum + item.amount, 0);
    return { totalExpense: expense, totalIncome: income };
  }, [monthlyTransactions]);

  const balance = totalIncome - totalExpense;

  const handleAddTransaction = () => {
    navigation.navigate("TransactionForm", {});
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>本月概览</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>总支出</Text>
              <Text style={[styles.summaryValue, styles.expense]}>
                {formatCurrency(totalExpense)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>总收入</Text>
              <Text style={[styles.summaryValue, styles.income]}>
                {formatCurrency(totalIncome)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>结余</Text>
              <Text style={[styles.summaryValue, balance >= 0 ? styles.income : styles.expense]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.accountsCard}>
          <Text style={styles.sectionTitle}>账户余额</Text>
          {accounts.length === 0 ? (
            <Text style={styles.emptyHint}>请前往“我的 - 账户管理”创建账户</Text>
          ) : (
            accounts.map((account) => (
              <View key={account.id} style={styles.accountRow}>
                <View>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountMeta}>
                    初始余额：{formatCurrency(account.initialBalance)}
                  </Text>
                </View>
                <Text style={styles.accountBalance}>{formatCurrency(getAccountBalance(account.id))}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <FloatingActionButton onPress={handleAddTransaction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 16
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  summaryItem: {
    flex: 1
  },
  summaryLabel: {
    fontSize: 13,
    color: "#888888",
    marginBottom: 6
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700"
  },
  expense: {
    color: "#E53935"
  },
  income: {
    color: "#2E7D32"
  },
  accountsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  emptyHint: {
    fontSize: 14,
    color: "#777777"
  },
  accountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  accountName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333"
  },
  accountMeta: {
    fontSize: 12,
    color: "#999999",
    marginTop: 4
  },
  accountBalance: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32"
  }
});
