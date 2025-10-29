export type UUID = string;

export type TransactionType = "expense" | "income";

export interface Account {
  id: UUID;
  name: string;
  initialBalance: number;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export interface Transaction {
  id: UUID;
  amount: number;
  type: TransactionType;
  categoryId: string;
  accountId: UUID;
  note?: string;
  occurredAt: string;
  createdAt: number;
  updatedAt: number;
  isDeleted: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

export interface PersistedLedger {
  accounts: Account[];
  transactions: Transaction[];
}
