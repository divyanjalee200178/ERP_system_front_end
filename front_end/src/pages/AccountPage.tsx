// src/pages/AccountPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/account.css";
import { PieChart } from "react-minimal-pie-chart";

interface Account {
    accountId?: number;
    accountCode: string;
    name: string;
    type: string; // Asset, Liability, Equity, Revenue, Expense
    subType: string;
    balance: number;
    status: string;
    bankName?: string; // ✅ Added bankName
}

interface PieData {
    title: string;
    value: number;
    color?: string;
}

const BASE_URL = "http://localhost:8081/api/v1/account";

const AccountPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [form, setForm] = useState<Account>({
        accountCode: "",
        name: "",
        type: "",
        subType: "",
        balance: 0,
        status: "Active",
        bankName: "",
    });
    const [accountId, setAccountId] = useState<number | null>(null);
    const [activeTopNav, setActiveTopNav] = useState<string>("Accounts");

    const topNavItems = ["Accounts", "Chart of Accounts", "Account Balances"];

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const res = await fetch(`${BASE_URL}/get`);
            if (!res.ok) throw new Error("Failed to fetch accounts");
            const data: Account[] = await res.json();
            setAccounts(data);
        } catch (err) {
            console.error(err);
            alert("Cannot load accounts. Check backend.");
        }
    };

    const saveAccount = async () => {
        if (!form.accountCode || !form.name) return alert("Fill all fields");
        await fetch(`${BASE_URL}/save`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        clearForm();
        loadAccounts();
    };

    const updateAccount = async () => {
        if (!accountId) return alert("Select account to update");
        await fetch(`${BASE_URL}/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, accountId }),
        });
        clearForm();
        loadAccounts();
    };

    const deleteAccount = async (id: number) => {
        await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
        loadAccounts();
    };

    const editAccount = (acc: Account) => {
        setAccountId(acc.accountId!);
        setForm(acc);
        setActiveTopNav("Accounts");
    };

    const clearForm = () => {
        setAccountId(null);
        setForm({
            accountCode: "",
            name: "",
            type: "",
            subType: "",
            balance: 0,
            status: "Active",
            bankName: "",
        });
    };

    const getGroupedAccounts = () => {
        const grouped: Record<string, Record<string, Account[]>> = {};
        accounts.forEach((acc) => {
            if (!grouped[acc.type]) grouped[acc.type] = {};
            const sub = acc.subType || "Main";
            if (!grouped[acc.type][sub]) grouped[acc.type][sub] = [];
            grouped[acc.type][sub].push(acc);
        });
        return grouped;
    };

    const groupedAccounts = getGroupedAccounts();

    const typeColors: Record<string, string> = {
        Asset: "#4caf50",
        Liability: "#f44336",
        Equity: "#2196f3",
        Revenue: "#ff9800",
        Expense: "#9c27b0",
    };

    const getAccountSummary = () => {
        const summary: Record<string, { count: number; total: number }> = {};
        let grandTotal = 0;
        accounts.forEach((acc) => {
            if (!summary[acc.type]) summary[acc.type] = { count: 0, total: 0 };
            summary[acc.type].count += 1;
            summary[acc.type].total += acc.balance;
            grandTotal += acc.balance;
        });
        return Object.entries(summary).map(([type, data]) => ({
            type,
            count: data.count,
            total: data.total,
            percentage: grandTotal ? ((data.total / grandTotal) * 100).toFixed(1) : "0",
        }));
    };

    const summary = getAccountSummary();

    const pieData: PieData[] = summary.map((row) => ({
        title: row.type,
        value: parseFloat(row.percentage),
        color: typeColors[row.type],
    }));

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                {/* Top Navbar */}
                <div className="top-navbar">
                    {topNavItems.map((item) => (
                        <button
                            key={item}
                            className={`top-btn ${activeTopNav === item ? "active" : ""}`}
                            onClick={() => setActiveTopNav(item)}
                        >
                            {item}
                        </button>
                    ))}
                    <button className="top-btn">Add Account</button>
                    <button className="top-btn">Export</button>
                    <button className="top-btn">Load Sample</button>
                    <input className="top-input" type="text" placeholder="Search accounts..." />
                    <select className="top-select">
                        <option>All Types</option>
                        <option>Asset</option>
                        <option>Liability</option>
                        <option>Equity</option>
                        <option>Revenue</option>
                        <option>Expense</option>
                    </select>
                    <select className="top-select">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>

                {/* Accounts List Form */}
                {activeTopNav === "Accounts" && (
                    <div>
                        <div className="card">
                            <h3>Add / Update Account</h3>
                            <input
                                placeholder="Code"
                                value={form.accountCode}
                                onChange={(e) => setForm({ ...form, accountCode: e.target.value })}
                            />
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                            <input
                                placeholder="Type"
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value })}
                            />
                            <input
                                placeholder="Sub-Type"
                                value={form.subType}
                                onChange={(e) => setForm({ ...form, subType: e.target.value })}
                            />
                            <input
                                placeholder="Balance"
                                type="number"
                                value={form.balance}
                                onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                            />
                            <input
                                placeholder="Bank Name"
                                value={form.bankName}
                                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                            />
                            <select
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value })}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                            <div className="form-buttons">
                                <button onClick={saveAccount}>Save</button>
                                <button onClick={updateAccount}>Update</button>
                            </div>
                        </div>

                        <div className="card">
                            <h3>Accounts List</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Sub-Type</th>
                                    <th>Balance</th>
                                    <th>Bank Name</th> {/* ✅ Added */}
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {accounts.map((acc) => (
                                    <tr key={acc.accountId}>
                                        <td>{acc.accountCode}</td>
                                        <td>{acc.name}</td>
                                        <td>{acc.type}</td>
                                        <td>{acc.subType}</td>
                                        <td>${acc.balance.toLocaleString()}</td>
                                        <td>{acc.bankName || "-"}</td> {/* Display */}
                                        <td>{acc.status}</td>
                                        <td>
                                            <button onClick={() => editAccount(acc)}>Edit</button>
                                            <button onClick={() => deleteAccount(acc.accountId!)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Chart of Accounts */}
                {activeTopNav === "Chart of Accounts" && (
                    <div style={{ padding: "10px" }}>
                        {Object.keys(groupedAccounts).map((type) => (
                            <div
                                key={type}
                                style={{
                                    backgroundColor: "#fff",
                                    padding: "15px",
                                    marginBottom: "20px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                }}
                            >
                                <h3 style={{ color: typeColors[type] || "#000" }}>{type} Accounts</h3>
                                {Object.keys(groupedAccounts[type]).map((subType) => (
                                    <div key={subType} style={{ marginLeft: "20px", marginBottom: "15px" }}>
                                        {subType !== "Main" && (
                                            <h4 style={{ color: "#333", fontWeight: "500" }}>{subType}</h4>
                                        )}
                                        {groupedAccounts[type][subType].map((acc) => (
                                            <div
                                                key={acc.accountId}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    padding: "5px 10px",
                                                    borderBottom: "1px solid #ccc",
                                                    color: "#000",
                                                }}
                                            >
                                                <span>{acc.accountCode}</span>
                                                <span>{acc.name}</span>
                                                <span>{acc.bankName || "-"}</span>
                                                <span>${acc.balance.toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}

                {/* Account Balances with Pie Chart */}
                {activeTopNav === "Account Balances" && (
                    <div className="card" style={{ marginTop: "20px" }}>
                        <h3>Account Balances</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Account Type</th>
                                <th>Number of Accounts</th>
                                <th>Total Balance</th>
                                <th>Percentage</th>
                            </tr>
                            </thead>
                            <tbody>
                            {summary.map((row) => (
                                <tr key={row.type}>
                                    <td>{row.type}</td>
                                    <td>{row.count}</td>
                                    <td>${row.total.toLocaleString()}</td>
                                    <td>{row.percentage}%</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div style={{ maxWidth: "400px", margin: "30px auto" }}>
                            <PieChart<PieData>
                                data={pieData}
                                label={({ dataEntry }) => `${dataEntry.title} ${dataEntry.value}%`}
                                labelStyle={{ fontSize: "5px", fontFamily: "sans-serif" }}
                                animate
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AccountPage;