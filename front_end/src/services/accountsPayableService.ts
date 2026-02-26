import axios from "axios";
import type { Invoice } from "../types/accountsPayableTypes";

interface InvoiceAPI {
    id: number;
    supplierId: number;   // FIXED
    invoiceNumber: string;
    date: string;
    amount: number;
    status: string;
}

interface Supplier {
    supplierId: number;
    name: string;
}

const INVOICE_URL = "http://localhost:8081/api/v1/invoice/get";
const SUPPLIER_URL = "http://localhost:8081/api/v1/supplier/get";

let suppliersCache: Supplier[] = [];

export const getAllInvoices = async (): Promise<Invoice[]> => {

    if (suppliersCache.length === 0) {
        const supplierRes = await axios.get(SUPPLIER_URL);
        suppliersCache = supplierRes.data as Supplier[];
    }

    const invoiceRes = await axios.get(INVOICE_URL);
    const invoices = invoiceRes.data as InvoiceAPI[];

    return invoices.map((item) => {
        const supplier = suppliersCache.find(
            (s) => s.supplierId === item.supplierId   // FIXED
        );

        const due = new Date(item.date);
        due.setDate(due.getDate() + 30);

        return {
            id: item.id,
            supplierName: supplier ? supplier.name : "Unknown",
            invoiceNumber: item.invoiceNumber,
            date: item.date,
            dueDate: due.toISOString().split("T")[0],
            amount: item.amount,
            status: item.status,
        };
    });
};