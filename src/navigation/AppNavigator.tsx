import { useMemo } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, View } from "react-native";
import { enableScreens } from "react-native-screens";

import { HomeScreen } from "@/screens/Home/HomeScreen";
import { TransactionsScreen } from "@/screens/Transactions/TransactionsScreen";
import { StatsScreen } from "@/screens/Stats/StatsScreen";
import { SettingsScreen } from "@/screens/Settings/SettingsScreen";
import { AccountListScreen } from "@/screens/Settings/AccountListScreen";
import { TransactionFormModal } from "@/screens/Transactions/TransactionFormModal";
import { AccountFormModal } from "@/screens/Settings/AccountFormModal";
import { useLedger } from "@/state/LedgerProvider";
import {
  RootStackParamList,
  TabParamList,
  SettingsStackParamList
} from "@/navigation/types";

enableScreens(true);

const RootStack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#F5F6FA"
  }
};

const SettingsStackNavigator = () => (
  <SettingsStack.Navigator>
    <SettingsStack.Screen
      name="SettingsHome"
      component={SettingsScreen}
      options={{ title: "我的" }}
    />
    <SettingsStack.Screen
      name="AccountList"
      component={AccountListScreen}
      options={{ title: "账户管理" }}
    />
  </SettingsStack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="HomeTab"
      component={HomeScreen}
      options={{ title: "首页" }}
    />
    <Tab.Screen
      name="TransactionsTab"
      component={TransactionsScreen}
      options={{ title: "明细" }}
    />
    <Tab.Screen
      name="StatsTab"
      component={StatsScreen}
      options={{ title: "统计" }}
    />
    <Tab.Screen
      name="SettingsTab"
      component={SettingsStackNavigator}
      options={{ headerShown: false, title: "我的" }}
    />
  </Tab.Navigator>
);

const LoadingState = () => (
  <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
    <ActivityIndicator size="large" color="#2F80ED" />
  </View>
);

export const AppNavigator = () => {
  const { isHydrated } = useLedger();
  const content = useMemo(() => {
    if (!isHydrated) {
      return <LoadingState />;
    }

    return (
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tabs"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="TransactionForm"
          component={TransactionFormModal}
          options={{ presentation: "modal", title: "记一笔" }}
        />
        <RootStack.Screen
          name="AccountForm"
          component={AccountFormModal}
          options={{ presentation: "modal", title: "账户" }}
        />
      </RootStack.Navigator>
    );
  }, [isHydrated]);

  return <NavigationContainer theme={navTheme}>{content}</NavigationContainer>;
};
