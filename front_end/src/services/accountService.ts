import axios from "axios";

const BASE_URL = "http://localhost:8081/api/v1/account";

export interface Account {
    accountId?: number;
    accountCode: string;
    name: string;
    type: string;
    subType: string;
    balance: number;
    status: string;
}

export const getAccounts = async (): Promise<Account[]> => {
    const { data } = await axios.get(`${BASE_URL}/get`);
    return data as Account[];
};
export const saveAccount = async (account: Account) => {
    return axios.post(`${BASE_URL}/save`, account);
};

export const updateAccount = async (account: Account) => {
    return axios.put(`${BASE_URL}/update`, account);
};

export const deleteAccount = async (id: number) => {
    return axios.delete(`${BASE_URL}/delete/${id}`);
};
