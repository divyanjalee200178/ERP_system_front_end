import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useLocation } from "react-router-dom";
import "../styles/settings.css";

interface Integration {
    id: number;
    name: string;
    apiKey: string;
    status: string;
}

const IntegrationsPage: React.FC = () => {

    const location = useLocation();

    const defaultForm = {
        name: "",
        apiKey: "",
        status: "Active"
    };

    const [form, setForm] = useState(defaultForm);

    // ✅ Load from localStorage (NO useEffect needed)
    const [integrations, setIntegrations] = useState<Integration[]>(() => {
        const saved = localStorage.getItem("integrationsList");
        return saved ? JSON.parse(saved) : [];
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        setLoading(true);

        const newIntegration: Integration = {
            id: Date.now(),
            ...form
        };

        const updatedList = [...integrations, newIntegration];

        setIntegrations(updatedList);
        localStorage.setItem("integrationsList", JSON.stringify(updatedList));

        setForm(defaultForm);

        setTimeout(() => {
            alert("Integration Saved ✅");
            setLoading(false);
        }, 400);
    };

    const handleDelete = (id: number) => {
        const filtered = integrations.filter(item => item.id !== id);
        setIntegrations(filtered);
        localStorage.setItem("integrationsList", JSON.stringify(filtered));
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <header className="page-header">
                    <h1>🔗 Integrations</h1>

                    <nav className="page-nav">
                        <Link to="/module-setup"
                              className={location.pathname === "/module-setup" ? "nav-link active" : "nav-link"}>
                            General Setup
                        </Link>

                        <Link to="/companyInformation"
                              className={location.pathname === "/companyInformation" ? "nav-link active" : "nav-link"}>
                            Company Information
                        </Link>

                        <Link to="/financial-setup"
                              className={location.pathname === "/financial-setup" ? "nav-link active" : "nav-link"}>
                            Financial Setup
                        </Link>

                        <Link to="/integrations"
                              className={location.pathname === "/integrations" ? "nav-link active" : "nav-link"}>
                            Integrations
                        </Link>
                    </nav>
                </header>

                {/* FORM CARD */}
                <div className="settings-card">

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Integration Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Stripe, PayPal"
                            />
                        </div>

                        <div className="form-group">
                            <label>API Key</label>
                            <input
                                name="apiKey"
                                value={form.apiKey}
                                onChange={handleChange}
                                placeholder="Enter API Key"
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>
                            <select name="status" value={form.status} onChange={handleChange}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                    </div>

                    {/* ACTION BUTTON */}
                    <div className="settings-actions">
                        <button className="btn save-btn" onClick={handleSave} disabled={loading}>
                            💾 Save Integration
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="settings-card">

                    <h3>Saved Integrations</h3>

                    <table className="settings-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>API Key</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {integrations.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: "center" }}>
                                    No integrations added yet
                                </td>
                            </tr>
                        ) : (
                            integrations.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.apiKey}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        <button
                                            className="btn delete-btn"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
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

export default IntegrationsPage;