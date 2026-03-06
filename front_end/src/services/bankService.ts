// src/services/bankService.ts
import axios from "axios";
import type { AccountDTO, TransactionDTO } from "../types/bankType";

const BASE_URL = "http://localhost:8081/api/v1";

export const bankService = {

    getAccounts: async (): Promise<AccountDTO[]> => {
        const res = await axios.get(`${BASE_URL}/account/get`);
        return res.data as AccountDTO[];
    },

    // getTransactions: async (): Promise<TransactionDTO[]> => {
    //     const res = await axios.get(`${BASE_URL}/transaction/get`);
    //     return res.data as TransactionDTO[];
    // },

    saveAccount: async (account: AccountDTO): Promise<AccountDTO> => {
        const res = await axios.post(`${BASE_URL}/account/save`, account);
        return res.data as AccountDTO;
    },

    updateAccount: async (account: AccountDTO): Promise<AccountDTO> => {
        // ✅ Call backend endpoint without ID in URL
        const res = await axios.put(`${BASE_URL}/account/update`, account);
        return res.data as AccountDTO;
    },

    deleteAccount: async (accountId: number): Promise<void> => {
        await axios.delete(`${BASE_URL}/account/delete/${accountId}`);
    },

    // saveTransaction: async (transaction: TransactionDTO): Promise<TransactionDTO> => {
    //     const res = await axios.post(`${BASE_URL}/transaction/save`, transaction);
    //     return res.data as TransactionDTO;
    // },

    getTransactions: async (): Promise<TransactionDTO[]> => {
        const res = await axios.get(`${BASE_URL}/transaction/get`);
        return res.data as TransactionDTO[];
    },

    saveTransaction: async (transaction: TransactionDTO): Promise<TransactionDTO> => {
        const res = await axios.post(`${BASE_URL}/transaction/save`, transaction);
        return res.data as TransactionDTO;
    },

    updateTransaction: async (transaction: TransactionDTO): Promise<TransactionDTO> => {
        const res = await axios.put(`${BASE_URL}/transaction/update`, transaction);
        return res.data as TransactionDTO;
    },

    deleteTransaction: async (transactionId: number): Promise<void> => {
        await axios.delete(`${BASE_URL}/transaction/delete/${transactionId}`);
    },


};