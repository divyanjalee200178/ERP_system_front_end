// src/pages/AssetDisposalsPage.tsx
import React, { useEffect, useState, ChangeEvent } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { fixedAssetService } from "../services/fixedAssetService";
import type { FixedAssetDTO } from "../types/fixedAsset";
import "../styles/DepreciationSchedule.css";

const AssetDisposalsPage: React.FC = () => {
    const [assets, setAssets] = useState<FixedAssetDTO[]>([]);
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

    // Load all assets on page load
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const data = await fixedAssetService.getAssets();
                setAssets(data.filter(a => a.status !== "Disposed"));
            } catch (error) {
                console.error("Failed to load assets", error);
                alert("Failed to load assets");
            }
        };
        fetchAssets();
    }, []);

    // Handle form input changes
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSelectedAsset(prev => ({
            ...prev,
            [name]:
                name === "purchaseValue" ||
                name === "currentValue" ||
                name === "accountId"
                    ? Number(value)
                    : value,
        }));
    };

    // Dispose selected asset
    const handleDispose = async () => {
        if (!selectedAsset.assetId) return alert("Select an asset to dispose");
        if (!selectedAsset.status) return alert("Select disposal status");

        try {
            await fixedAssetService.updateAsset({
                ...selectedAsset,
                status: "Disposed",
            });
            alert("Asset disposed successfully!");
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

            const data = await fixedAssetService.getAssets();
            setAssets(data.filter(a => a.status !== "Disposed"));
        } catch (error) {
            console.error("Dispose failed:", error);
            alert("Failed to dispose asset");
        }
    };

    // Load asset into form for disposal
    const handleEdit = (asset: FixedAssetDTO) => setSelectedAsset(asset);

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Asset Disposals</h1>
                    <nav className="page-nav">
                        <Link to="/Depreciation-schedule" className="nav-link">Depreciation Schedule</Link>
                        <Link to="/fixed-assets" className="nav-link">Fixed Assets</Link>
                        <Link to="/asset-disposals" className="nav-link">Asset Disposals</Link>
                    </nav>
                </header>

                {/* FORM */}
                <section className="card form-card">
                    <h3>Dispose Asset</h3>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="assetSelect">Select Asset</label>
                            <select
                                id="assetSelect"
                                name="assetId"
                                value={selectedAsset.assetId}
                                onChange={handleChange}
                            >
                                <option value={0}>-- Select Asset --</option>
                                {assets.map(asset => (
                                    <option key={asset.assetId} value={asset.assetId}>
                                        {asset.assetName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="status">Disposal Status</label>
                            <select
                                id="status"
                                name="status"
                                value={selectedAsset.status}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Status --</option>
                                <option value="Disposed">Disposed</option>
                                <option value="Sold">Sold</option>
                                <option value="Damaged">Damaged</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <button className="btn primary" onClick={handleDispose}>
                                Dispose
                            </button>
                        </div>
                    </div>
                </section>

                {/* TABLE */}
                <section className="card table-section">
                    <h3>Active Assets</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Purchase Date</th>
                            <th>Purchase Value</th>
                            <th>Current Value</th>
                            <th>Status</th>
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
                                <td>
                                    <button onClick={() => handleEdit(asset)}>Select</button>
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

export default AssetDisposalsPage;