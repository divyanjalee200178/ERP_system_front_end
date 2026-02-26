// src/pages/FixedAssetPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { fixedAssetService } from "../services/fixedAssetService";
import type { FixedAssetDTO, AccountDTO } from "../types/fixedAsset";
import "../styles/FixedAsset.css";

function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === "object" && error !== null && "message" in error;
}

const FixedAssetPage: React.FC = () => {
    const [assets, setAssets] = useState<FixedAssetDTO[]>([]);
    const [accounts, setAccounts] = useState<AccountDTO[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<FixedAssetDTO>({
        assetId: 0,
        assetName: "",
        category: "",
        purchaseDate: "",
        purchaseValue: 0,
        currentValue: 0,
        status: "",
        accountId: 0,
    });

    // ===== Handlers =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedAsset(prev => ({
            ...prev,
            [name]: ["purchaseValue", "currentValue", "accountId"].includes(name)
                ? parseFloat(value)
                : value,
        }));
    };

    const handleSave = async () => {
        if (!selectedAsset.assetName) return alert("Enter Asset Name");
        if (selectedAsset.accountId === 0) return alert("Select Account");

        try {
            if (selectedAsset.assetId !== 0) await fixedAssetService.updateAsset(selectedAsset);
            else await fixedAssetService.saveAsset(selectedAsset);

            handleClear();
            await fetchData();
        } catch (error: unknown) {
            if (isErrorWithMessage(error)) console.error("Save failed:", error.message);
            else console.error("Save failed:", error);
            alert("Error while saving asset.");
        }
    };

    const handleEdit = (asset: FixedAssetDTO) => setSelectedAsset(asset);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure to delete this asset?")) return;
        try {
            await fixedAssetService.deleteAsset(id);
            await fetchData();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Error deleting asset.");
        }
    };

    const handleClear = () => {
        setSelectedAsset({
            assetId: 0,
            assetName: "",
            category: "",
            purchaseDate: "",
            purchaseValue: 0,
            currentValue: 0,
            status: "",
            accountId: 0,
        });
    };

    const getAccountName = (accountId: number) => {
        const acc = accounts.find(a => a.accountId === accountId);
        return acc ? acc.name : "N/A";
    };

    // ===== Load Data =====
    const fetchData = async (): Promise<void> => {
        try {
            const [assetData, accountData] = await Promise.all<FixedAssetDTO[] | AccountDTO[]>([
                fixedAssetService.getAssets(),
                fixedAssetService.getAccounts(),
            ]) as [FixedAssetDTO[], AccountDTO[]];

            setAssets(assetData);
            setAccounts(accountData);
        } catch (error: unknown) {
            if (isErrorWithMessage(error)) console.error("Load failed:", error.message);
            else console.error("Load failed:", error);
            alert("Failed to load data.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Fixed Asset Management</h1>
                    <nav className="page-nav">
                        <Link to="/Depreciation-schedule" className="nav-link">Depreciation Schedule</Link>
                        <Link to="/fixed-assets" className="nav-link">Fixed Assets</Link>
                        <Link to="/asset-disposals" className="nav-link">Asset Disposals</Link>
                    </nav>
                </header>

                <section className="card form-card">
                    <h3>Add / Update Fixed Asset</h3>
                    <div className="form-grid">
                        <input type="text" name="assetName" placeholder="Asset Name" value={selectedAsset.assetName} onChange={handleChange} />
                        <input type="text" name="category" placeholder="Category" value={selectedAsset.category} onChange={handleChange} />
                        <input type="date" name="purchaseDate" value={selectedAsset.purchaseDate} onChange={handleChange} />
                        <input type="number" name="purchaseValue" placeholder="Purchase Value" value={selectedAsset.purchaseValue} onChange={handleChange} />
                        <input type="number" name="currentValue" placeholder="Current Value" value={selectedAsset.currentValue} onChange={handleChange} />
                        <select name="status" value={selectedAsset.status} onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Disposed">Disposed</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <select name="accountId" value={selectedAsset.accountId} onChange={handleChange}>
                            <option value={0}>Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.accountId} value={acc.accountId}>{acc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="btn-group">
                        <button className="btn primary" onClick={handleSave}>{selectedAsset.assetId !== 0 ? "Update" : "Save"}</button>
                        <button className="btn warning" onClick={handleClear}>Clear</button>
                    </div>
                </section>

                <section className="card table-section">
                    <h3>Fixed Assets</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Purchase Date</th>
                            <th>Purchase Value</th>
                            <th>Current Value</th>
                            <th>Status</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {assets.map(asset => (
                            <tr key={asset.assetId}>
                                <td>{asset.assetName}</td>
                                <td>{asset.category}</td>
                                <td>{asset.purchaseDate}</td>
                                <td>{asset.purchaseValue}</td>
                                <td>{asset.currentValue}</td>
                                <td>{asset.status}</td>
                                <td>{getAccountName(asset.accountId)}</td>
                                <td>
                                    <button onClick={() => handleEdit(asset)}>Edit</button>
                                    <button onClick={() => handleDelete(asset.assetId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default FixedAssetPage;