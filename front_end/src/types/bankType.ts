export interface AccountDTO {
    accountId: number;
    accountCode: string;
    name: string;
    type: string;
    bankName: string;
    balance: number;
    lastUpdated?: string;
    status: string;
}

export interface TransactionDTO {
    transactionId: number;
    bankAccount: string;
    type: "CREDIT" | "DEBIT";
    reference: string;
    accountId: number;
    date: string;
    amount: number;
}