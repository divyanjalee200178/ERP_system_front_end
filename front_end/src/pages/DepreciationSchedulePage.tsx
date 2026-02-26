// src/pages/DepreciationSchedulePage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import { fixedAssetService } from "../services/fixedAssetService";
import type { FixedAssetDTO, DepreciationRow } from "../types/depreciationTypes";
import "../styles/DepreciationSchedule.css";

const DepreciationSchedulePage: React.FC = () => {
    const [assets, setAssets] = useState<FixedAssetDTO[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<number>(0);
    const [usefulLife, setUsefulLife] = useState<number>(5);
    const [schedule, setSchedule] = useState<DepreciationRow[]>([]);

    // Load assets
    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const data = await fixedAssetService.getAssets();
                setAssets(data);
            } catch (error) {
                console.error("Failed to load assets", error);
                alert("Failed to load assets");
            }
        };
        fetchAssets();
    }, []);

    // Generate Depreciation Schedule
    const generateSchedule = (): void => {
        const asset = assets.find(a => a.assetId === selectedAssetId);
        if (!asset) {
            alert("Select Asset");
            return;
        }
        if (usefulLife <= 0) {
            alert("Enter valid useful life");
            return;
        }

        const yearlyDep = asset.purchaseValue / usefulLife;
        let opening = asset.purchaseValue;

        const rows: DepreciationRow[] = [];
        for (let year = 1; year <= usefulLife; year++) {
            const closing = opening - yearlyDep;
            rows.push({
                year,
                openingValue: parseFloat(opening.toFixed(2)),
                depreciation: parseFloat(yearlyDep.toFixed(2)),
                closingValue: parseFloat(closing.toFixed(2)),
            });
            opening = closing;
        }
        setSchedule(rows);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">

                {/* HEADER */}
                <header className="page-header">
                    <h1>Depreciation Schedule</h1>
                    <nav className="page-nav">
                        <Link to="/Depreciation-schedule" className="nav-link">Depreciation Schedule</Link>
                        <Link to="/fixed-assets" className="nav-link">Fixed Assets</Link>
                        <Link to="/asset-disposals" className="nav-link">Asset Disposals</Link>
                    </nav>
                </header>

                {/* FORM SECTION */}
                <section className="card form-card">
                    <h3>Generate Depreciation Schedule</h3>

                    <div className="form-grid">

                        <div className="form-field">
                            <label htmlFor="assetSelect">Select Asset</label>
                            <select
                                id="assetSelect"
                                value={selectedAssetId}
                                onChange={(e) => setSelectedAssetId(Number(e.target.value))}
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
                            <label htmlFor="usefulLife">Useful Life (Years)</label>
                            <input
                                id="usefulLife"
                                type="number"
                                value={usefulLife}
                                onChange={(e) => setUsefulLife(Number(e.target.value))}
                                placeholder="Enter Useful Life in Years"
                            />
                        </div>

                        <div className="form-field">
                            <button className="btn primary" onClick={generateSchedule}>
                                Generate
                            </button>
                        </div>

                    </div>
                </section>

                {/* TABLE SECTION */}
                {schedule.length > 0 && (
                    <section className="card table-section">
                        <h3>Depreciation Table (Straight Line Method)</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Year</th>
                                <th>Opening Value</th>
                                <th>Depreciation</th>
                                <th>Closing Value</th>
                            </tr>
                            </thead>
                            <tbody>
                            {schedule.map(row => (
                                <tr key={row.year}>
                                    <td>{row.year}</td>
                                    <td>{row.openingValue}</td>
                                    <td>{row.depreciation}</td>
                                    <td>{row.closingValue}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}
            </main>
        </div>
    );
};

export default DepreciationSchedulePage;