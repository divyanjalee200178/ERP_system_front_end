export interface ARInvoiceDTO {
    id: number;
    customerName?: string; // dynamically added
    invoiceNumber: string;
    date: string;
    dueDate: string;
    amount: number;
    balance: number;
    status: string;
    supplierId?: number;
}

export interface SupplierDTO {
    supplierId: number;  // must match API
    name: string;
    contactNumber?: string;
    email?: string;
    address?: string;
}