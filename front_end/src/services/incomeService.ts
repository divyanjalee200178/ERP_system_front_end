import axios from "axios"
import type { IncomeInvoice, ExpenseTransaction } from "../types/incomeTypes"

const API_URL = "http://localhost:8081/api/v1" // backend URL

export const incomeService = {

    async getInvoices(): Promise<IncomeInvoice[]> {
        const response = await axios.get(`${API_URL}/invoice/get`)
        return response.data
    },

    async getTransactions(): Promise<ExpenseTransaction[]> {
        const response = await axios.get(`${API_URL}/transaction/get`)
        return response.data
    }

}