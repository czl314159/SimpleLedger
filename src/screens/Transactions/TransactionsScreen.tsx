import { useMemo } from "react";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
  StyleSheet,
  Text,
  View
} from "react-native";

import { EmptyState } from "@/components/EmptyState";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { TransactionRow } from "@/components/TransactionRow";
import { useLedger } from "@/state/LedgerProvider";
import { RootStackParamList, TabParamList } from "@/navigation/types";
import { Transaction } from "@/types";
import { formatAsDate, formatDateLabel } from "@/utils/datetime";

type Navigation = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "TransactionsTab">,
  NativeStackNavigationProp<RootStackParamList>
>;

interface TransactionSection {
  title: string;
  data: Transaction[];
  subtitle: string;
}

export const TransactionsScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { transactions, categories, getAccountById } = useLedger();

  const sections = useMemo<SectionListData<Transaction, TransactionSection>[]>(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
    );

    const grouped = sorted.reduce<Record<string, TransactionSection>>((acc, transaction) => {
      const dateKey = formatAsDate(transaction.occurredAt);
      if (!acc[dateKey]) {
        acc[dateKey] = {
          title: dateKey,
          subtitle: formatDateLabel(transaction.occurredAt),
          data: []
        };
      }
      acc[dateKey].data.push(transaction);
      return acc;
    }, {});

    return Object.values(grouped);
  }, [transactions]);

  const handleAdd = () => {
    navigation.navigate("TransactionForm", {});
  };

  const handleEdit = (transactionId: string) => {
    navigation.navigate("TransactionForm", { transactionId });
  };

  const renderItem = ({ item }: SectionListRenderItemInfo<Transaction, TransactionSection>) => {
    const category = categories.find((cat) => cat.id === item.categoryId);
    const account = getAccountById(item.accountId);
    return (
      <TransactionRow
        transaction={item}
        category={category}
        account={account}
        onPress={() => handleEdit(item.id)}
      />
    );
  };

  const renderSectionHeader = ({ section }: { section: TransactionSection }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderTitle}>{section.subtitle}</Text>
      <Text style={styles.sectionHeaderSubtitle}>{section.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <EmptyState
          title="暂无交易"
          description="点击下方的“+”按钮，记录第一笔交易"
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          contentContainerStyle={styles.listContent}
          stickySectionHeadersEnabled
          SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
        />
      )}

      <FloatingActionButton onPress={handleAdd} />
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
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F5F6FA"
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333"
  },
  sectionHeaderSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 2
  },
  sectionSeparator: {
    height: 12
  }
});
