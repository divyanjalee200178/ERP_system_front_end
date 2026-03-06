export interface IncomeInvoice {
    id: number
    amount: number
    status: string
    date: string
}

export interface ExpenseTransaction {
    transactionId: number
    type: string
    amount: number
    date: string
}