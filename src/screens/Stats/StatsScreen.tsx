import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { BarChart } from "@/components/charts/BarChart";
import { PieChart } from "@/components/charts/PieChart";
import { EmptyState } from "@/components/EmptyState";
import { useLedger } from "@/state/LedgerProvider";
import { formatCurrency } from "@/utils/format";
import { getEndOfCurrentMonth, isWithinCurrentMonth } from "@/utils/datetime";

export const StatsScreen = () => {
  const { transactions, categories } = useLedger();

  const { pieData, barData, totalExpense } = useMemo(() => {
    const expenses = transactions.filter(
      (transaction) => transaction.type === "expense" && isWithinCurrentMonth(transaction.occurredAt)
    );

    const total = expenses.reduce((sum, item) => sum + item.amount, 0);

    const list = categories.reduce<{ label: string; value: number; color: string }[]>((acc, category) => {
      if (category.type !== "expense") {
        return acc;
      }
      const amount = expenses
        .filter((item) => item.categoryId === category.id)
        .reduce((sum, item) => sum + item.amount, 0);
      if (amount > 0) {
        acc.push({ label: category.name, value: amount, color: category.color });
      }
      return acc;
    }, []);

    const end = getEndOfCurrentMonth();
    const daysInMonth = end.getDate();
    const bar = Array.from({ length: daysInMonth }).map((_, index) => {
      const day = index + 1;
      const totalForDay = expenses
        .filter((item) => new Date(item.occurredAt).getDate() === day)
        .reduce((sum, item) => sum + item.amount, 0);
      return { label: day.toString(), value: totalForDay };
    });

    return {
      pieData: list,
      barData: bar,
      totalExpense: total
    };
  }, [transactions, categories]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>本月支出统计</Text>

      {totalExpense === 0 ? (
        <EmptyState title="暂无统计数据" description="本月还没有支出记录" />
      ) : (
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>支出分类占比</Text>
            <PieChart data={pieData} size={240} innerRadius={60} />
            <View style={styles.legend}>
              {pieData.map((item) => (
                <View key={item.label} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <Text style={styles.legendLabel}>{item.label}</Text>
                  <Text style={styles.legendValue}>{formatCurrency(item.value)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>每日支出趋势</Text>
            <BarChart data={barData} />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FA"
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 16
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333"
  },
  cards: {
    gap: 16
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 12
  },
  legend: {
    marginTop: 12,
    gap: 8
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: "#555555"
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333"
  }
});
