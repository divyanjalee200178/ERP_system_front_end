// src/services/fixedAssetService.ts
import type { FixedAssetDTO, AccountDTO } from "../types/fixedAsset";

const BASE_URL = "http://localhost:8081/api/v1/fixed-asset";
const ACCOUNT_URL = "http://localhost:8081/api/v1/account";

export const fixedAssetService = {
    async getAssets(): Promise<FixedAssetDTO[]> {
        const res = await fetch(`${BASE_URL}/get`);
        if (!res.ok) throw new Error("Failed to fetch assets");
        return res.json();
    },

    async getAccounts(): Promise<AccountDTO[]> {
        const res = await fetch(`${ACCOUNT_URL}/get`);
        if (!res.ok) throw new Error("Failed to fetch accounts");
        return res.json();
    },

    async saveAsset(asset: FixedAssetDTO): Promise<void> {
        const res = await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(asset),
        });
        if (!res.ok) throw new Error("Save failed");
    },

    async updateAsset(asset: FixedAssetDTO): Promise<void> {
        const res = await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(asset),
        });
        if (!res.ok) throw new Error("Update failed");
    },

    async deleteAsset(id: number): Promise<void> {
        const res = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Delete failed");
    },
};