// services/financialService.ts
import axios from "axios";
import type { Transaction, Account, Invoice } from "../types/financialTypes";

const API_URL = "http://localhost:8081/api/v1";

export const financialService = {
    getAccounts: async (): Promise<Account[]> => {
        const res = await axios.get(`${API_URL}/account/get`); // check real route in backend
        return res.data;
    },
    getTransactions: async (): Promise<Transaction[]> => {
        const res = await axios.get(`${API_URL}/transaction/get`);
        return res.data;
    },
    getInvoices: async (): Promise<Invoice[]> => {
        const res = await axios.get(`${API_URL}/invoice/get`);
        return res.data;
    }
};