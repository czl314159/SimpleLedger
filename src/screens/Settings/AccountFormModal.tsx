import { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { useLedger } from "@/state/LedgerProvider";
import { RootStackParamList } from "@/navigation/types";
import { parseNumber } from "@/utils/format";

type Props = NativeStackScreenProps<RootStackParamList, "AccountForm">;

export const AccountFormModal = ({ route, navigation }: Props) => {
  const { accountId } = route.params ?? {};
  const { getAccountById, createAccount, updateAccount, deleteAccount } = useLedger();
  const existing = accountId ? getAccountById(accountId) : undefined;

  const [name, setName] = useState(existing?.name ?? "");
  const [initialBalance, setInitialBalance] = useState(
    existing ? String(existing.initialBalance) : ""
  );
  const [errors, setErrors] = useState<{ name?: string; initialBalance?: string }>({});

  const validate = () => {
    const nextErrors: { name?: string; initialBalance?: string } = {};
    if (!name.trim()) {
      nextErrors.name = "账户名称不能为空";
    }
    const parsed = parseNumber(initialBalance);
    if (parsed === null) {
      nextErrors.initialBalance = "初始余额必须填写数字";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const parsed = parseNumber(initialBalance);
    if (parsed === null) {
      return;
    }
    if (existing) {
      await updateAccount(existing.id, { name, initialBalance: parsed });
    } else {
      await createAccount({ name, initialBalance: parsed });
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) {
      return;
    }
    Alert.alert("确认删除", "确定要删除该账户吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          await deleteAccount(existing.id);
          navigation.goBack();
        }
      }
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>账户名称</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="例如：现金、支付宝"
            style={[styles.input, errors.name ? styles.inputError : undefined]}
          />
          {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>初始余额</Text>
          <TextInput
            value={initialBalance}
            onChangeText={setInitialBalance}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={[styles.input, errors.initialBalance ? styles.inputError : undefined]}
          />
          {errors.initialBalance ? <Text style={styles.errorText}>{errors.initialBalance}</Text> : null}
        </View>

        <View style={styles.actions}>
          {existing ? (
            <Text style={styles.delete} onPress={handleDelete}>
              删除账户
            </Text>
          ) : null}
          <Text style={styles.save} onPress={handleSave}>
            保存
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  content: {
    padding: 16,
    gap: 16
  },
  field: {
    gap: 8
  },
  label: {
    fontSize: 14,
    color: "#555555"
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF"
  },
  inputError: {
    borderColor: "#E53935"
  },
  errorText: {
    fontSize: 12,
    color: "#E53935"
  },
  actions: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  delete: {
    fontSize: 14,
    color: "#E53935"
  },
  save: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2F80ED"
  }
});
