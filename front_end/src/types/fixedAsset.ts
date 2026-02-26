// src/types/fixedAsset.ts
export interface FixedAssetDTO {
    assetId: number;
    assetName: string;
    category: string;
    purchaseDate: string;
    purchaseValue: number;
    currentValue: number;
    status: string;
    accountId: number;
}

export interface AccountDTO {
    accountId: number;
    name: string;
}