// src/types/invoiceTypes.ts

export interface InvoiceDTO {
    id?: number;
    invoiceNumber: string;
    date: string;
    dueDate?: string;
    amount: number;
    taxRate: number;
    discount: number;
    status: string;
    currency: string;
    supplierId?: number;
    purchaseOrderId?: number;
}

export interface PurchaseOrder {
    id: number;
    poNumber: string;
}

export interface SupplierDTO {
    supplierId: number;
    name: string;
    contactNumber?: string;
    email?: string;
    address?: string;
    status?: string;
}