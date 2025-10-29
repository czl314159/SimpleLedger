import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
    {description ? <Text style={styles.description}>{description}</Text> : null}
    {action ? <View style={styles.action}>{action}</View> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333"
  },
  description: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20
  },
  action: {
    marginTop: 8
  }
});
