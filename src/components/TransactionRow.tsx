import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Account, Category, Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";
import { formatDateLabel } from "@/utils/datetime";

interface TransactionRowProps {
  transaction: Transaction;
  category?: Category;
  account?: Account;
  onPress?: () => void;
}

export const TransactionRow = memo(({ transaction, category, account, onPress }: TransactionRowProps) => {
  const amountPrefix = transaction.type === "expense" ? "-" : "+";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed ? styles.pressed : null]}
    >
      <View style={styles.left}>
        <Text style={styles.category}>{category?.name ?? "未分类"}</Text>
        <Text style={styles.note} numberOfLines={1}>
          {transaction.note || account?.name || "无备注"}
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.amount, transaction.type === "expense" ? styles.expense : styles.income]}>
          {amountPrefix}
          {formatCurrency(transaction.amount)}
        </Text>
        <Text style={styles.date}>{formatDateLabel(transaction.occurredAt)}</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF"
  },
  pressed: {
    backgroundColor: "#F0F4FF"
  },
  left: {
    flex: 1,
    marginRight: 12
  },
  category: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4
  },
  note: {
    fontSize: 12,
    color: "#888888",
    maxWidth: 160
  },
  right: {
    alignItems: "flex-end"
  },
  amount: {
    fontSize: 16,
    fontWeight: "600"
  },
  expense: {
    color: "#E53935"
  },
  income: {
    color: "#2E7D32"
  },
  date: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4
  }
});
