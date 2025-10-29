import { useEffect, useMemo, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

import { useLedger } from "@/state/LedgerProvider";
import { RootStackParamList } from "@/navigation/types";
import { parseNumber } from "@/utils/format";
import { formatAsDate } from "@/utils/datetime";

type Props = NativeStackScreenProps<RootStackParamList, "TransactionForm">;

export const TransactionFormModal = ({ route, navigation }: Props) => {
  const { transactionId } = route.params ?? {};
  const {
    transactions,
    accounts,
    categories,
    getCategoryById,
    getAccountById,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useLedger();

  const existing = useMemo(
    () => transactions.find((transaction) => transaction.id === transactionId),
    [transactions, transactionId]
  );

  const [amount, setAmount] = useState(existing ? String(existing.amount) : "");
  const [type, setType] = useState<"expense" | "income">(existing?.type ?? "expense");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? "");
  const [accountId, setAccountId] = useState(existing?.accountId ?? "");
  const [note, setNote] = useState(existing?.note ?? "");
  const [date, setDate] = useState(existing ? new Date(existing.occurredAt) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (existing) {
      navigation.setOptions({ title: "编辑交易" });
    } else {
      navigation.setOptions({ title: "记一笔" });
    }
  }, [existing, navigation]);

  const filteredCategories = useMemo(
    () => categories.filter((item) => item.type === type),
    [categories, type]
  );

  useEffect(() => {
    if (!categoryId || filteredCategories.every((category) => category.id !== categoryId)) {
      setCategoryId(filteredCategories[0]?.id ?? "");
    }
  }, [filteredCategories, categoryId]);

  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const parsedAmount = parseNumber(amount);
    if (parsedAmount === null || parsedAmount <= 0) {
      nextErrors.amount = "金额必须大于0";
    }
    if (!categoryId) {
      nextErrors.categoryId = "请选择分类";
    }
    if (!accountId) {
      nextErrors.accountId = "请选择账户";
    }
    if (!date) {
      nextErrors.date = "请选择交易日期";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }
    const parsedAmount = parseNumber(amount);
    if (parsedAmount === null) {
      return;
    }
    const payload = {
      amount: parsedAmount,
      type,
      categoryId,
      accountId,
      occurredAt: new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds()
      ).toISOString(),
      note
    };
    if (existing) {
      await updateTransaction(existing.id, payload);
    } else {
      await createTransaction(payload);
    }
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!existing) {
      return;
    }
    Alert.alert("确认删除", "确定要逻辑删除这条交易吗？", [
      { text: "取消", style: "cancel" },
      {
        text: "删除",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(existing.id);
          navigation.goBack();
        }
      }
    ]);
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const selectedCategory = categoryId ? getCategoryById(categoryId) : undefined;
  const selectedAccount = accountId ? getAccountById(accountId) : undefined;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>金额</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={[styles.input, errors.amount ? styles.inputError : undefined]}
          />
          {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>交易类型</Text>
          <View style={styles.segment}>
            <Pressable
              onPress={() => setType("expense")}
              style={[styles.segmentButton, type === "expense" && styles.segmentButtonActive]}
            >
              <Text style={[styles.segmentLabel, type === "expense" && styles.segmentLabelActive]}>
                支出
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setType("income")}
              style={[styles.segmentButton, type === "income" && styles.segmentButtonActive]}
            >
              <Text style={[styles.segmentLabel, type === "income" && styles.segmentLabelActive]}>
                收入
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>分类</Text>
          <View style={[styles.pickerWrapper, errors.categoryId ? styles.inputError : undefined]}>
            <Picker selectedValue={categoryId} onValueChange={setCategoryId}>
              {filteredCategories.length === 0 ? (
                <Picker.Item label="暂无分类" value="" />
              ) : (
                filteredCategories.map((category) => (
                  <Picker.Item key={category.id} label={category.name} value={category.id} />
                ))
              )}
            </Picker>
          </View>
          {errors.categoryId ? <Text style={styles.errorText}>{errors.categoryId}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>账户</Text>
          <View style={[styles.pickerWrapper, errors.accountId ? styles.inputError : undefined]}>
            <Picker selectedValue={accountId} onValueChange={setAccountId}>
              {accounts.length === 0 ? (
                <Picker.Item label="暂无账户" value="" />
              ) : (
                accounts.map((account) => (
                  <Picker.Item key={account.id} label={account.name} value={account.id} />
                ))
              )}
            </Picker>
          </View>
          {errors.accountId ? <Text style={styles.errorText}>{errors.accountId}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>交易日期</Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            style={[styles.dateButton, errors.date ? styles.inputError : undefined]}
          >
            <Text style={styles.dateButtonText}>{formatAsDate(date.toISOString())}</Text>
          </Pressable>
          {errors.date ? <Text style={styles.errorText}>{errors.date}</Text> : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>备注（可选）</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="输入备注"
            style={[styles.input, styles.multilineInput]}
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>即将保存</Text>
          <Text style={styles.summaryText}>
            类型：{type === "expense" ? "支出" : "收入"} / 分类：{selectedCategory?.name ?? "未选择"}
          </Text>
          <Text style={styles.summaryText}>账户：{selectedAccount?.name ?? "未选择"}</Text>
          <Text style={styles.summaryText}>日期：{formatAsDate(date.toISOString())}</Text>
        </View>

        <View style={styles.actions}>
          {existing ? (
            <Text style={styles.delete} onPress={handleDelete}>
              删除
            </Text>
          ) : null}
          <Text style={styles.save} onPress={handleSave}>
            保存
          </Text>
        </View>
      </ScrollView>

      {showDatePicker ? (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      ) : null}
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
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top"
  },
  inputError: {
    borderColor: "#E53935"
  },
  errorText: {
    fontSize: 12,
    color: "#E53935"
  },
  segment: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center"
  },
  segmentButtonActive: {
    backgroundColor: "#2F80ED",
    borderRadius: 8
  },
  segmentLabel: {
    fontSize: 14,
    color: "#666666"
  },
  segmentLabelActive: {
    color: "#FFFFFF",
    fontWeight: "600"
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333333"
  },
  summaryCard: {
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    padding: 16,
    gap: 6
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333"
  },
  summaryText: {
    fontSize: 13,
    color: "#666666"
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
