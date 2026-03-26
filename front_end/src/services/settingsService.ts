// settingsService.ts
import axios from "axios";
import type { CompanySettings } from "../types/CompanySettings";

const API = "http://localhost:8081/api/v1/settings";

export const settingsService = {
    getSettings: async (): Promise<CompanySettings> => {
        const res = await axios.get(`${API}/get`);
        return res.data;
    },

    saveSettings: async (data: CompanySettings) => {
        await axios.post(`${API}/save`, data);
    },

    testConnection: async (): Promise<boolean> => {
        try {
            const res = await axios.get(`${API}/test-connection`);
            return res.status === 200;
        } catch {
            return false;
        }
    },

    backupConfig: async (): Promise<string> => {
        // Fetch backup as arraybuffer instead of blob
        const res = await axios.get(`${API}/backup`, {  });

        // Convert ArrayBuffer to Blob manually
        const blob = new Blob([res.data], { type: "application/zip" });

        // Return URL for download
        return URL.createObjectURL(blob);
    }
};