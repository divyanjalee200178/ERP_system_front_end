import axios from "axios";

// ===== BASE URLS =====
const BASE_URL = "http://localhost:8081/api/v1/journal-entry";
const INVOICE_URL = "http://localhost:8081/api/v1/invoice/get";
const ACCOUNT_URL = "http://localhost:8081/api/v1/account/get";

// ===== Types =====
export interface JournalEntry {
    id?: number;
    date: string;
    journalNo?: string;
    description: string;
    debitTotal: number;
    creditTotal: number;
    status: string;
    invoiceId: number;
    accountId: number;
}

export interface Account {
    accountId: number;
    name: string;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
}

export interface Account {
    accountId: number;
    name: string;
}

// ===== JournalEntry CRUD =====
export const getJournals = (): Promise<JournalEntry[]> =>
    axios.get(`${BASE_URL}/get`).then(res => res.data);

export const saveJournal = (journal: JournalEntry): Promise<JournalEntry> =>
    axios.post(`${BASE_URL}/save`, journal).then(res => res.data);

export const updateJournal = (journal: JournalEntry): Promise<JournalEntry> =>
    axios.put(`${BASE_URL}/update`, journal).then(res => res.data);

export const deleteJournal = (id: number): Promise<void> =>
    axios.delete(`${BASE_URL}/delete/${id}`).then(res => res.data);

// ===== Invoice & Account Fetch =====
export const getInvoices = (): Promise<Invoice[]> =>
    axios.get(INVOICE_URL).then(res => res.data);

export const getAccounts = (): Promise<Account[]> =>
    axios.get(ACCOUNT_URL).then(res => res.data);