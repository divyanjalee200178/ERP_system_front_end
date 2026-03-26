import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useLocation } from "react-router-dom";
import "../styles/settings.css";

interface FinancialSetting {
    fiscalYearStart: string;
    baseCurrency: string;
    accountingMethod: string;
}

const FinancialSetupPage: React.FC = () => {
    const location = useLocation();

    const defaultForm: FinancialSetting = {
        fiscalYearStart: "January",
        baseCurrency: "USD",
        accountingMethod: "ACCRUAL",
    };

    const [form, setForm] = useState<FinancialSetting>(defaultForm);
    // const [savedSettings, setSavedSettings] = useState<FinancialSetting[]>([]);
    const [loading, setLoading] = useState(false);

    // Instead of using useEffect to set state
    const [savedSettings, setSavedSettings] = useState<FinancialSetting[]>(() => {
        const saved = localStorage.getItem("financialSettingsList");
        return saved ? JSON.parse(saved) : [];
    });



    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setLoading(true);

        // Add current form to savedSettings
        const newSaved = [...savedSettings, form];
        setSavedSettings(newSaved);

        // Save updated array to localStorage
        localStorage.setItem("financialSettingsList", JSON.stringify(newSaved));

        setTimeout(() => {
            alert("Financial Setting Saved ✅");
            setForm(defaultForm); // Reset form
            setLoading(false);
        }, 300);
    };

    const handleClear = () => {
        if (window.confirm("Clear all saved settings?")) {
            setSavedSettings([]);
            localStorage.removeItem("financialSettingsList");
            setForm(defaultForm);
        }
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <header className="page-header">
                    <h1>💰 Financial Setup</h1>

                    <nav className="page-nav">
                        <Link
                            to="/module-setup"
                            className={location.pathname === "/module-setup" ? "nav-link active" : "nav-link"}
                        >
                            General Setup
                        </Link>

                        <Link
                            to="/companyInformation"
                            className={location.pathname === "/companyInformation" ? "nav-link active" : "nav-link"}
                        >
                            Company Information
                        </Link>

                        <Link
                            to="/financial-setup"
                            className={location.pathname === "/financial-setup" ? "nav-link active" : "nav-link"}
                        >
                            Financial Setup
                        </Link>

                        <Link
                            to="/integrations"
                            className={location.pathname === "/integrations" ? "nav-link active" : "nav-link"}
                        >
                            Integrations
                        </Link>
                    </nav>
                </header>

                {/* FORM CARD */}
                <div className="settings-card">

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Fiscal Year Start</label>
                            <select
                                name="fiscalYearStart"
                                value={form.fiscalYearStart}
                                onChange={handleChange}
                            >
                                <option>January</option>
                                <option>April</option>
                                <option>July</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Base Currency</label>
                            <select
                                name="baseCurrency"
                                value={form.baseCurrency}
                                onChange={handleChange}
                            >
                                <option value="USD">USD - US Dollar</option>
                                <option value="LKR">LKR - Sri Lankan Rupee</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Accounting Method</label>
                            <select
                                name="accountingMethod"
                                value={form.accountingMethod}
                                onChange={handleChange}
                            >
                                <option value="ACCRUAL">Accrual Basis</option>
                                <option value="CASH">Cash Basis</option>
                            </select>
                        </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="settings-actions">
                        <button
                            className="btn save-btn"
                            onClick={handleSave}
                            disabled={loading}
                        >
                            💾 Save
                        </button>

                        <button
                            className="btn clear-btn"
                            onClick={handleClear}
                            disabled={loading}
                        >
                            🧹 Clear All
                        </button>
                    </div>

                </div>

                {/* TABLE SHOWING SAVED SETTINGS */}
                <div className="settings-card" style={{ marginTop: "20px" }}>
                    <h3>Saved Financial Settings</h3>
                    <table className="settings-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Fiscal Year Start</th>
                            <th>Base Currency</th>
                            <th>Accounting Method</th>
                        </tr>
                        </thead>
                        <tbody>
                        {savedSettings.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>No settings saved yet.</td>
                            </tr>
                        ) : (
                            savedSettings.map((s, idx) => (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{s.fiscalYearStart}</td>
                                    <td>{s.baseCurrency}</td>
                                    <td>{s.accountingMethod}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

            </main>
        </div>
    );
};

export default FinancialSetupPage;