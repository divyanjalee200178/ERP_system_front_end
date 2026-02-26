import axios from "axios";
import type { ARInvoiceDTO } from "../types/accountsReceivableTypes";

export interface SupplierDTO {
    supplierId: number; // match API
    name: string;
    contactNumber?: string;
    email?: string;
    address?: string;
}

const INVOICE_URL = "http://localhost:8081/api/v1/invoice/get";
const SUPPLIER_URL = "http://localhost:8081/api/v1/supplier/get";

// Cache suppliers to avoid multiple requests
let suppliersCache: SupplierDTO[] = [];

export const getAllInvoices = async (): Promise<ARInvoiceDTO[]> => {
    // Fetch suppliers if cache is empty
    if (suppliersCache.length === 0) {
        const supplierRes = await axios.get(SUPPLIER_URL);
        suppliersCache = supplierRes.data as SupplierDTO[];
        console.log("Suppliers fetched:", suppliersCache);
    }

    // Fetch invoices
    const invoiceRes = await axios.get(INVOICE_URL);
    const invoices = invoiceRes.data as ARInvoiceDTO[];

    // Map supplier name to invoices
    return invoices.map((item) => {
        // Match invoice.supplierId to supplier.supplierId from API
        const supplier = suppliersCache.find((s) => s.supplierId === item.supplierId);

        return {
            ...item,
            customerName: supplier ? supplier.name : "Unknown",
            balance: item.balance ?? item.amount, // fallback if balance missing
        };
    });
};