import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { v4 as uuid } from "uuid";

import { defaultCategories } from "@/data/categories";
import { loadLedger, storeLedger } from "@/storage";
import { Account, Category, PersistedLedger, Transaction, TransactionType } from "@/types";

interface LedgerState {
  accounts: Account[];
  transactions: Transaction[];
}

type Action =
  | { type: "HYDRATE"; payload: PersistedLedger }
  | { type: "UPSERT_ACCOUNT"; payload: Account }
  | { type: "UPSERT_TRANSACTION"; payload: Transaction }
  | { type: "MARK_ACCOUNT_DELETED"; payload: { id: string; updatedAt: number } }
  | { type: "MARK_TRANSACTION_DELETED"; payload: { id: string; updatedAt: number } };

interface LedgerContextValue {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  isHydrated: boolean;
  createAccount: (input: { name: string; initialBalance: number }) => Promise<Account>;
  updateAccount: (id: string, input: { name: string; initialBalance: number }) => Promise<Account>;
  deleteAccount: (id: string) => Promise<void>;
  createTransaction: (input: CreateTransactionInput) => Promise<Transaction>;
  updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  getAccountBalance: (accountId: string) => number;
  getAccountById: (accountId: string) => Account | undefined;
  getCategoryById: (categoryId: string) => Category | undefined;
}

interface CreateTransactionInput {
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  occurredAt: string;
  note?: string;
}

type UpdateTransactionInput = CreateTransactionInput;

const initialState: LedgerState = {
  accounts: [],
  transactions: []
};

const LedgerContext = createContext<LedgerContextValue | null>(null);

const reducer = (state: LedgerState, action: Action): LedgerState => {
  switch (action.type) {
    case "HYDRATE":
      return {
        accounts: action.payload.accounts,
        transactions: action.payload.transactions
      };
    case "UPSERT_ACCOUNT": {
      const existingIndex = state.accounts.findIndex((item) => item.id === action.payload.id);
      if (existingIndex === -1) {
        return { ...state, accounts: [...state.accounts, action.payload] };
      }
      const nextAccounts = [...state.accounts];
      nextAccounts[existingIndex] = action.payload;
      return { ...state, accounts: nextAccounts };
    }
    case "MARK_ACCOUNT_DELETED": {
      const nextAccounts = state.accounts.map((account) =>
        account.id === action.payload.id
          ? { ...account, isDeleted: true, updatedAt: action.payload.updatedAt }
          : account
      );
      return { ...state, accounts: nextAccounts };
    }
    case "UPSERT_TRANSACTION": {
      const existingIndex = state.transactions.findIndex((item) => item.id === action.payload.id);
      if (existingIndex === -1) {
        return { ...state, transactions: [...state.transactions, action.payload] };
      }
      const nextTransactions = [...state.transactions];
      nextTransactions[existingIndex] = action.payload;
      return { ...state, transactions: nextTransactions };
    }
    case "MARK_TRANSACTION_DELETED": {
      const nextTransactions = state.transactions.map((transaction) =>
        transaction.id === action.payload.id
          ? { ...transaction, isDeleted: true, updatedAt: action.payload.updatedAt }
          : transaction
      );
      return { ...state, transactions: nextTransactions };
    }
    default:
      return state;
  }
};

export const LedgerProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const restore = async () => {
      const persisted = await loadLedger();
      if (persisted) {
        dispatch({ type: "HYDRATE", payload: persisted });
      }
      setIsHydrated(true);
    };
    void restore();
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }
    const persist = async () => {
      const snapshot: PersistedLedger = {
        accounts: state.accounts,
        transactions: state.transactions
      };
      await storeLedger(snapshot);
    };
    void persist();
  }, [isHydrated, state.accounts, state.transactions]);

  const createAccount = useCallback<LedgerContextValue["createAccount"]>(async (input) => {
    const timestamp = Date.now();
    const newAccount: Account = {
      id: uuid(),
      name: input.name.trim(),
      initialBalance: input.initialBalance,
      createdAt: timestamp,
      updatedAt: timestamp,
      isDeleted: false
    };
    dispatch({ type: "UPSERT_ACCOUNT", payload: newAccount });
    return newAccount;
  }, []);

  const updateAccount = useCallback<LedgerContextValue["updateAccount"]>(
    async (id, input) => {
      const existing = state.accounts.find((account) => account.id === id);
      if (!existing) {
        throw new Error("Account not found");
      }
      const updated: Account = {
        ...existing,
        name: input.name.trim(),
        initialBalance: input.initialBalance,
        updatedAt: Date.now()
      };
      dispatch({ type: "UPSERT_ACCOUNT", payload: updated });
      return updated;
    },
    [state.accounts]
  );

  const deleteAccount = useCallback<LedgerContextValue["deleteAccount"]>(async (id) => {
    const existing = state.accounts.find((account) => account.id === id);
    if (!existing) {
      throw new Error("Account not found");
    }
    dispatch({ type: "MARK_ACCOUNT_DELETED", payload: { id, updatedAt: Date.now() } });
  }, [state.accounts]);

  const createTransaction = useCallback<LedgerContextValue["createTransaction"]>(async (input) => {
    const timestamp = Date.now();
    const transaction: Transaction = {
      id: uuid(),
      amount: input.amount,
      type: input.type,
      categoryId: input.categoryId,
      accountId: input.accountId,
      note: input.note?.trim() || undefined,
      occurredAt: input.occurredAt,
      createdAt: timestamp,
      updatedAt: timestamp,
      isDeleted: false
    };
    dispatch({ type: "UPSERT_TRANSACTION", payload: transaction });
    return transaction;
  }, []);

  const updateTransaction = useCallback<LedgerContextValue["updateTransaction"]>(
    async (id, input) => {
      const existing = state.transactions.find((transaction) => transaction.id === id);
      if (!existing) {
        throw new Error("Transaction not found");
      }
      const updated: Transaction = {
        ...existing,
        amount: input.amount,
        type: input.type,
        categoryId: input.categoryId,
        accountId: input.accountId,
        note: input.note?.trim() || undefined,
        occurredAt: input.occurredAt,
        updatedAt: Date.now()
      };
      dispatch({ type: "UPSERT_TRANSACTION", payload: updated });
      return updated;
    },
    [state.transactions]
  );

  const deleteTransaction = useCallback<LedgerContextValue["deleteTransaction"]>(async (id) => {
    const existing = state.transactions.find((transaction) => transaction.id === id);
    if (!existing) {
      throw new Error("Transaction not found");
    }
    dispatch({ type: "MARK_TRANSACTION_DELETED", payload: { id, updatedAt: Date.now() } });
  }, [state.transactions]);

  const getAccountBalance = useCallback(
    (accountId: string) => {
      const target = state.accounts.find((account) => account.id === accountId);
      if (!target) {
        return 0;
      }
      const relevantTransactions = state.transactions.filter(
        (transaction) => !transaction.isDeleted && transaction.accountId === accountId
      );
      const income = relevantTransactions
        .filter((item) => item.type === "income")
        .reduce((sum, item) => sum + item.amount, 0);
      const expense = relevantTransactions
        .filter((item) => item.type === "expense")
        .reduce((sum, item) => sum + item.amount, 0);
      return target.initialBalance + income - expense;
    },
    [state.accounts, state.transactions]
  );

  const getAccountById = useCallback(
    (accountId: string) => state.accounts.find((account) => account.id === accountId),
    [state.accounts]
  );

  const getCategoryById = useCallback(
    (categoryId: string) => defaultCategories.find((category) => category.id === categoryId),
    []
  );

  const value = useMemo<LedgerContextValue>(
    () => ({
      accounts: state.accounts.filter((account) => !account.isDeleted),
      transactions: state.transactions.filter((transaction) => !transaction.isDeleted),
      categories: defaultCategories,
      isHydrated,
      createAccount,
      updateAccount,
      deleteAccount,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      getAccountBalance,
      getAccountById,
      getCategoryById
    }),
    [
      state.accounts,
      state.transactions,
      isHydrated,
      createAccount,
      updateAccount,
      deleteAccount,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      getAccountBalance,
      getAccountById,
      getCategoryById
    ]
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
};

export const useLedger = (): LedgerContextValue => {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error("useLedger must be used within LedgerProvider");
  }
  return context;
};
