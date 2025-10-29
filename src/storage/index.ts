import AsyncStorage from "@react-native-async-storage/async-storage";

import { PersistedLedger } from "@/types";

const STORAGE_KEY = "@minimal-ledger/state";

export const loadLedger = async (): Promise<PersistedLedger | null> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as PersistedLedger;
  } catch (error) {
    console.warn("[storage] Failed to load ledger from storage", error);
    return null;
  }
};

export const storeLedger = async (state: PersistedLedger): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("[storage] Failed to persist ledger to storage", error);
  }
};
