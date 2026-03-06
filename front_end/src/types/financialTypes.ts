// types.ts
export type Account = {
    accountId: number;
    name: string;
    bankName: string;
    balance: number;
};

export type Transaction = {
    transactionId: number;
    accountId: number;
    type: "CREDIT" | "DEBIT";
    amount: number;
    date: string;
    reference: string;
};

export type Invoice = {
    invoiceId: number;
    amount: number;
    status: string;
    date: string;
};