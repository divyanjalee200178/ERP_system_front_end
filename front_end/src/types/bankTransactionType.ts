// src/types/bankType.ts
export type TransactionDTO = {
    transactionId: number;
    bankAccount: string;
    type: "CREDIT" | "DEBIT";
    reference: string;
    accountId: number;
    date: string;
    amount: number;
    isReconciled?: boolean;
};

export type AccountDTO = {
    accountId: number;
    name: string;
    bankName: string;
    balance: number;
};