import { useMemo } from "react";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { FloatingActionButton } from "@/components/FloatingActionButton";
import { useLedger } from "@/state/LedgerProvider";
import { formatCurrency } from "@/utils/format";
import { RootStackParamList, SettingsStackParamList } from "@/navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type Navigation = CompositeNavigationProp<
  NativeStackNavigationProp<SettingsStackParamList, "AccountList">,
  NativeStackNavigationProp<RootStackParamList>
>;

export const AccountListScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { accounts, getAccountBalance } = useLedger();

  const data = useMemo(
    () =>
      accounts
        .map((account) => ({
          id: account.id,
          name: account.name,
          initialBalance: account.initialBalance,
          balance: getAccountBalance(account.id)
        }))
        .sort((a, b) => a.name.localeCompare(b.name, "zh-CN")),
    [accounts, getAccountBalance]
  );

  const handleCreate = () => {
    navigation.navigate("AccountForm", {});
  };

  const handleEdit = (accountId: string) => {
    navigation.navigate("AccountForm", { accountId });
  };

  const renderItem = ({ item }: { item: (typeof data)[number] }) => (
    <Pressable
      onPress={() => handleEdit(item.id)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>初始余额：{formatCurrency(item.initialBalance)}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.balance}>{formatCurrency(item.balance)}</Text>
        <Text style={styles.hint}>点击编辑</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {data.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>暂无账户</Text>
          <Text style={styles.emptyDescription}>点击右下角的“+”按钮，创建第一个账户</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
        />
      )}
      <FloatingActionButton onPress={handleCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA"
  },
  listContent: {
    paddingBottom: 120
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  rowPressed: {
    backgroundColor: "#F0F4FF"
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333"
  },
  meta: {
    fontSize: 12,
    color: "#888888",
    marginTop: 6
  },
  right: {
    alignItems: "flex-end"
  },
  balance: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2E7D32"
  },
  hint: {
    fontSize: 12,
    color: "#AAAAAA",
    marginTop: 4
  },
  separator: {
    height: 12
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333"
  },
  emptyDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20
  }
});
