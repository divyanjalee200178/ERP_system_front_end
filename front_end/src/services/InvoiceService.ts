// src/services/invoiceService.ts
import type { InvoiceDTO, PurchaseOrder, SupplierDTO } from "../types/invoiceTypes";

const BASE_URL = "http://localhost:8081/api/v1/invoice";
const PO_URL = "http://localhost:8081/api/v1/purchase-order/get";
const SUPPLIER_URL = "http://localhost:8081/api/v1/supplier/get";

export const invoiceService = {
    getAll: async (): Promise<InvoiceDTO[]> => {
        const res = await fetch(`${BASE_URL}/get`);
        return res.json();
    },
    saveInvoice: async (invoice: InvoiceDTO) => {
        await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoice),
        });
    },
    updateInvoice: async (invoice: InvoiceDTO) => {
        await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(invoice),
        });
    },
    deleteInvoice: async (id: number) => {
        await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
    },
    getPurchaseOrders: async (): Promise<PurchaseOrder[]> => {
        const res = await fetch(PO_URL);
        return res.json();
    },
    getSuppliers: async (): Promise<SupplierDTO[]> => {
        const res = await fetch(SUPPLIER_URL);
        return res.json();
    },
};