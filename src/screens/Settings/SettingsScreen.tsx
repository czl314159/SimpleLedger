import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useLedger } from "@/state/LedgerProvider";
import { SettingsStackParamList } from "@/navigation/types";

type Navigation = NativeStackNavigationProp<SettingsStackParamList, "SettingsHome">;

export const SettingsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { accounts, transactions } = useLedger();

  const handleNavigateAccounts = () => {
    navigation.navigate("AccountList");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>账户与数据</Text>
      <Pressable onPress={handleNavigateAccounts} style={({ pressed }) => [styles.cell, pressed && styles.cellPressed]}>
        <View>
          <Text style={styles.cellTitle}>账户管理</Text>
          <Text style={styles.cellDescription}>共 {accounts.length} 个启用账户</Text>
        </View>
        <Text style={styles.cellArrow}>›</Text>
      </Pressable>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>数据摘要</Text>
        <Text style={styles.statsText}>有效交易：{transactions.length} 条</Text>
        <Text style={styles.statsText}>本地存储：离线可用</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16
  },
  sectionHeader: {
    fontSize: 14,
    color: "#888888"
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1
  },
  cellPressed: {
    backgroundColor: "#F0F4FF"
  },
  cellTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333"
  },
  cellDescription: {
    fontSize: 12,
    color: "#888888",
    marginTop: 6
  },
  cellArrow: {
    fontSize: 24,
    color: "#BBBBBB",
    marginLeft: 8
  },
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    gap: 8
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333"
  },
  statsText: {
    fontSize: 14,
    color: "#555555"
  }
});
