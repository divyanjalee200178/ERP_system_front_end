export interface BudgetDTO {
    budgetId: number;
    budgetAmount: number;
    actualAmount: number;
    variance: number;
    percentageUsed: number;
    status: string;
    accountId: number;
}

export interface AccountDTO {
    accountId: number;
    name: string;
}