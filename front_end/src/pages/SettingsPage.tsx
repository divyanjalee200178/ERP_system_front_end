import React, { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import { settingsService } from "../services/settingsService"
import type { CompanySettings } from "../types/CompanySettings"
import "../styles/settings.css"
import {Link} from "react-router-dom";

const SettingsPage: React.FC = () => {

    const defaultForm: CompanySettings = {
        companyName: "",
        taxId: "",
        baseCurrency: "USD",
        fiscalYearStart: "January",
        accountingMethod: "ACCRUAL"
    }

    const [form, setForm] = useState<CompanySettings>(defaultForm)
    const [loading, setLoading] = useState(false)

    // Load settings on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await settingsService.getSettings()
                if (data) setForm(data)
            } catch (e) {
                console.error("Load error", e)
                alert("Failed to load settings ❌")
            }
        }
        loadData()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSave = async () => {
        try {
            setLoading(true)
            await settingsService.saveSettings(form)
            alert("Settings Saved Successfully ✅")
        } catch (error) {
            console.error("Save error:", error)
            alert("Error saving settings ❌")
        } finally {
            setLoading(false)
        }
    }

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear all fields?")) {
            setForm(defaultForm)
        }
    }

    const handleTestConnection = async () => {
        try {
            setLoading(true)
            const success = await settingsService.testConnection()
            if (success) {
                alert("Connection successful ✅")
            } else {
                alert("Connection failed ❌")
            }
        } catch (error) {
            console.error("Test Connection error:", error)
            alert("Connection test failed ❌")
        } finally {
            setLoading(false)
        }
    }

    const handleBackupConfig = async () => {
        try {
            setLoading(true)
            const backupFileUrl = await settingsService.backupConfig()
            const link = document.createElement("a")
            link.href = backupFileUrl
            link.download = `backup_${new Date().toISOString()}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            alert("Backup created and downloaded ✅")
        } catch (error) {
            console.error("Backup error:", error)
            alert("Backup failed ❌. Check server permissions.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">

                <div className="settings-header">
                    <h1>⚙️ Module Setup</h1>
                    <p>Manage company and financial configurations</p>
                </div>

                {/* Header bar with tabs */}
                <header className="page-header">
                    <nav className="page-nav">
                        <Link to="/module-setup" className="nav-link">General Setup</Link>
                        <Link to="/companyInformation" className="nav-link">Company Information</Link>
                        <Link to="/financial-setup" className="nav-link">Financial Setup</Link>
                        <Link to="/integrations" className="nav-link">
                            Integrations
                        </Link>
                    </nav>
                </header>
                <div className="settings-card">

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Company Name</label>
                            <input
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tax ID</label>
                            <input
                                name="taxId"
                                value={form.taxId}
                                onChange={handleChange}
                                placeholder="Enter tax ID"
                            />
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

                    <div className="settings-actions">
                        <button className="btn save-btn" onClick={handleSave} disabled={loading}>
                            💾 Save Settings
                        </button>

                        <button className="btn clear-btn" onClick={handleClear} disabled={loading}>
                            🧹 Clear
                        </button>

                        <button className="btn test-btn" onClick={handleTestConnection} disabled={loading}>
                            🔌 Test Connection
                        </button>

                        <button className="btn backup-btn" onClick={handleBackupConfig} disabled={loading}>
                            📦 Backup Config
                        </button>
                    </div>

                </div>

            </main>
        </div>
    )
}

export default SettingsPage