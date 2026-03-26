import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link, useLocation } from "react-router-dom";
import "../styles/settings.css";

interface Company {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
}

const CompanyInformationPage: React.FC = () => {

    const location = useLocation();

    const defaultForm: Company = {
        companyName: "",
        email: "",
        phone: "",
        address: "",
        website: ""
    };

    const [form, setForm] = useState<Company>(defaultForm);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCompanies = () => {
            const saved = localStorage.getItem("companies");
            if (saved) setCompanies(JSON.parse(saved));
        };
        loadCompanies();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Save
    const handleSave = () => {
        setLoading(true);

        const updated = [...companies, form];
        setCompanies(updated);

        // save to localStorage
        localStorage.setItem("companies", JSON.stringify(updated));

        setTimeout(() => {
            alert("Company Information Saved ✅");
            setForm(defaultForm);
            setLoading(false);
        }, 300);
    };

    // ✅ Clear
    const handleClear = () => {
        if (window.confirm("Clear all fields?")) {
            setForm(defaultForm);
        }
    };

    // ✅ Delete
    const handleDelete = (index: number) => {
        const updated = companies.filter((_, i) => i !== index);
        setCompanies(updated);

        localStorage.setItem("companies", JSON.stringify(updated));
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* HEADER */}
                <header className="page-header">
                    <h1>🏢 Company Information</h1>

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

                        <Link to="/financial-setup" className="nav-link">
                            Financial Setup
                        </Link>

                        <Link to="/integrations" className="nav-link">
                            Integrations
                        </Link>
                    </nav>
                </header>

                {/* FORM */}
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
                            <label>Email</label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="Enter phone"
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Address</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Enter address"
                            />
                        </div>

                        <div className="form-group">
                            <label>Website</label>
                            <input
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="Enter website"
                            />
                        </div>

                    </div>

                    {/* ACTION BUTTONS */}
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
                            🧹 Clear
                        </button>

                    </div>
                </div>

                {/* TABLE */}
                <div className="table-card">
                    <h2>📋 Company List</h2>

                    <table className="company-table">
                        <thead>
                        <tr>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Website</th>
                            <th>Action</th>
                        </tr>
                        </thead>

                        <tbody>
                        {companies.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center" }}>
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            companies.map((c, index) => (
                                <tr key={index}>
                                    <td>{c.companyName}</td>
                                    <td>{c.email}</td>
                                    <td>{c.phone}</td>
                                    <td>{c.address}</td>
                                    <td>{c.website}</td>
                                    <td>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(index)}
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

export default CompanyInformationPage;