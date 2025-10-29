import { ReactNode } from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: ReactNode;
  style?: ViewStyle;
}

export const FloatingActionButton = ({ onPress, icon, style }: FloatingActionButtonProps) => (
  <View style={[styles.container, style]}>
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="新增"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : undefined
      ]}
    >
      {icon ?? <DefaultIcon />}
    </Pressable>
  </View>
);

const DefaultIcon = () => (
  <View style={styles.plusWrapper}>
    <View style={[styles.bar, styles.barHorizontal]} />
    <View style={[styles.bar, styles.barVertical]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 24,
    right: 24,
    elevation: 6
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#2F80ED",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  buttonPressed: {
    opacity: 0.9
  },
  plusWrapper: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center"
  },
  bar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderRadius: 2
  },
  barHorizontal: {
    width: 20,
    height: 3
  },
  barVertical: {
    width: 3,
    height: 20
  }
});
