import type { BudgetDTO, AccountDTO } from "../types/budgetTypes";

const BASE_URL = "http://localhost:8081/api/v1/budget";
const ACCOUNT_URL = "http://localhost:8081/api/v1/account";

export const budgetService = {

    async getBudgets(): Promise<BudgetDTO[]> {
        const res = await fetch(`${BASE_URL}/get`);
        if (!res.ok) throw new Error("Failed to fetch budgets");
        return res.json();
    },

    async getAccounts(): Promise<AccountDTO[]> {
        const res = await fetch(`${ACCOUNT_URL}/get`);
        if (!res.ok) throw new Error("Failed to fetch accounts");
        return res.json();
    },

    async saveBudget(budget: BudgetDTO): Promise<void> {
        const res = await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(budget),
        });
        if (!res.ok) throw new Error("Save failed");
    },

    async updateBudget(budget: BudgetDTO): Promise<void> {
        const res = await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(budget),
        });
        if (!res.ok) throw new Error("Update failed");
    },

    async deleteBudget(id: number): Promise<void> {
        const res = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Delete failed");
    },
};