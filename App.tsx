import "react-native-gesture-handler";
import "react-native-get-random-values";

import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppNavigator } from "@/navigation/AppNavigator";
import { LedgerProvider } from "@/state/LedgerProvider";

const App = () => (
  <SafeAreaProvider>
    <LedgerProvider>
      <AppNavigator />
      <StatusBar barStyle="dark-content" />
    </LedgerProvider>
  </SafeAreaProvider>
);

export default App;
