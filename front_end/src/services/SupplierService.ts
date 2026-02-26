import type { SupplierDTO } from "../types/supplierTypes";

const BASE_URL = "http://localhost:8081/api/v1/supplier";

export const supplierService = {

    async getAll(): Promise<SupplierDTO[]> {
        const response = await fetch(`${BASE_URL}/get`);
        if (!response.ok) {
            throw new Error("Failed to fetch suppliers");
        }
        return response.json();
    },

    async save(data: Omit<SupplierDTO, "supplierId">) {
        const response = await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to save supplier");
        }

        return response.json();
    },

    async update(data: SupplierDTO) {
        const response = await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to update supplier");
        }

        return response.json();
    },

    async delete(id: number) {
        const response = await fetch(`${BASE_URL}/delete/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete supplier");
        }

        return response.json();
    }
};