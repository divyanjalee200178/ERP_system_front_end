export interface FixedAssetDTO {
    assetId: number;
    assetName: string;
    purchaseDate: string;
    purchaseValue: number;
    currentValue: number;
    accountId: number;
}

export interface DepreciationRow {
    year: number;
    openingValue: number;
    depreciation: number;
    closingValue: number;
}