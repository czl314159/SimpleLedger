export type RootStackParamList = {
  Tabs: undefined;
  TransactionForm: {
    transactionId?: string;
    accountId?: string;
  };
  AccountForm: {
    accountId?: string;
  };
};

export type HomeTabParamList = {
  Home: undefined;
};

export type TransactionsTabParamList = {
  TransactionsList: undefined;
};

export type StatsTabParamList = {
  StatsOverview: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  AccountList: undefined;
};

export type TabParamList = {
  HomeTab: undefined;
  TransactionsTab: undefined;
  StatsTab: undefined;
  SettingsTab: undefined;
};
