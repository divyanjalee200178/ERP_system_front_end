// src/pages/BudgetPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { budgetService } from "../services/budgetService";
import type { BudgetDTO, AccountDTO } from "../types/budgetTypes";
import { Link } from "react-router-dom";
import "../styles/budget.css";

function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === "object" && error !== null && "message" in error;
}

const BudgetPage: React.FC = () => {
    const [budgets, setBudgets] = useState<BudgetDTO[]>([]);
    const [accounts, setAccounts] = useState<AccountDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedBudget, setSelectedBudget] = useState<BudgetDTO>({
        budgetId: 0,
        budgetAmount: 0,
        actualAmount: 0,
        variance: 0,
        percentageUsed: 0,
        status: "",
        accountId: 0,
    });

    // ================= FETCH DATA =================
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            try {
                const budgetData = await budgetService.getBudgets();
                const accountData = await budgetService.getAccounts();
                if (isMounted) {
                    setBudgets(budgetData);
                    setAccounts(accountData);
                    setLoading(false);
                }
            } catch (error: unknown) {
                if (isErrorWithMessage(error)) console.error(error.message);
                else console.error(error);
                setLoading(false);
            }
        };

        Promise.resolve().then(loadData);

        return () => { isMounted = false; };
    }, []);

    // ================= HANDLERS =================
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSelectedBudget((prev) => ({
            ...prev,
            [name]: ["budgetAmount", "actualAmount", "accountId"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleSave = async () => {
        if (selectedBudget.accountId === 0) return alert("Select Account");
        try {
            if (selectedBudget.budgetId !== 0)
                await budgetService.updateBudget(selectedBudget);
            else
                await budgetService.saveBudget(selectedBudget);

            await refreshData();
            handleClear();
        } catch (error) {
            console.error("Save failed:", error);
            alert("Failed to save budget.");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this budget?")) return;
        try {
            await budgetService.deleteBudget(id);
            await refreshData();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete budget.");
        }
    };

    const handleEdit = (budget: BudgetDTO) => {
        setSelectedBudget(budget);
    };

    const handleClear = () => {
        setSelectedBudget({
            budgetId: 0,
            budgetAmount: 0,
            actualAmount: 0,
            variance: 0,
            percentageUsed: 0,
            status: "",
            accountId: 0,
        });
    };

    const refreshData = async () => {
        const budgetData = await budgetService.getBudgets();
        setBudgets(budgetData);
    };

    const getAccountName = (accountId: number): string => {
        const acc = accounts.find(a => a.accountId === accountId);
        return acc ? acc.name : "N/A";
    };

    // ============ DASHBOARD CARDS CALCULATION ============
    const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.actualAmount, 0);
    const percentUsed = totalBudget ? (totalActual / totalBudget) * 100 : 0;
    const overBudgetItems = budgets.filter(b => b.actualAmount > b.budgetAmount).length;

    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">
                {/* ===== PAGE HEADER ===== */}
                <header className="page-header">
                    <h1>Budget Management</h1>
                    <nav className="page-nav">
                        <Link to="/budgetVsActualPage" className="nav-link">Budget Vs Actual</Link>
                        <Link to="/budget" className="nav-link">Budget</Link>
                        <Link to="/Variance-details" className="nav-link">Variance Details</Link>
                    </nav>
                </header>

                {/* ===== DASHBOARD CARDS ===== */}
                <section className="card dashboard-cards">
                    <div className="card-item">
                        <h4>Current Budget</h4>
                        <p>Q4 2023</p>
                    </div>
                    <div className="card-item">
                        <h4>Total Budget</h4>
                        <p>${totalBudget.toLocaleString()}</p>
                    </div>
                    <div className="card-item">
                        <h4>Actual vs Budget</h4>
                        <p>{percentUsed.toFixed(2)}%</p>
                    </div>
                    <div className="card-item">
                        <h4>Over Budget Items</h4>
                        <p>{overBudgetItems}</p>
                    </div>
                </section>

                {/* ================= FORM ================= */}
                <section className="card form-card">
                    <h3>Add / Update Budget</h3>

                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="budgetAmount">Budget Amount</label>
                            <input
                                type="number"
                                id="budgetAmount"
                                name="budgetAmount"
                                placeholder="Budget Amount"
                                value={selectedBudget.budgetAmount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="actualAmount">Actual Amount</label>
                            <input
                                type="number"
                                id="actualAmount"
                                name="actualAmount"
                                placeholder="Actual Amount"
                                value={selectedBudget.actualAmount}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="accountId">Account</label>
                            <select
                                id="accountId"
                                name="accountId"
                                value={selectedBudget.accountId}
                                onChange={handleChange}
                            >
                                <option value={0}>Select Account</option>
                                {accounts.map(acc => (
                                    <option key={acc.accountId} value={acc.accountId}>
                                        {acc.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="btn-group">
                        <button className="btn primary" onClick={handleSave}>
                            {selectedBudget.budgetId !== 0 ? "Update" : "Save"}
                        </button>
                        <button className="btn warning" onClick={handleClear}>Clear</button>
                    </div>
                </section>

                {/* ================= TABLE ================= */}
                <section className="card table-section">
                    <h3>Budgets</h3>

                    <table>
                        <thead>
                        <tr>
                            <th>Budget</th>
                            <th>Actual</th>
                            <th>Variance</th>
                            <th>% Used</th>
                            <th>Status</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {budgets.map((b) => (
                            <tr key={b.budgetId}>
                                <td>{b.budgetAmount}</td>
                                <td>{b.actualAmount}</td>
                                <td>{b.variance}</td>
                                <td>{b.percentageUsed.toFixed(2)}%</td>
                                <td>{b.status}</td>
                                <td>{getAccountName(b.accountId)}</td>
                                <td>
                                    <button onClick={() => handleEdit(b)}>Edit</button>
                                    <button onClick={() => handleDelete(b.budgetId)}>Delete</button>
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

export default BudgetPage;