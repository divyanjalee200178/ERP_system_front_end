import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { budgetService } from "../services/budgetService";
import type { BudgetDTO, AccountDTO } from "../types/budgetTypes";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import "../styles/budget.css";

/* Extend BudgetDTO to include computed fields */
interface BudgetWithVariance extends BudgetDTO {
    accountName: string;
    variance: number;
    percentageUsed: number;
    status: string;
}

const VarianceDashboardPage: React.FC = () => {

    const [budgets, setBudgets] = useState<BudgetWithVariance[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountsData: AccountDTO[] = await budgetService.getAccounts();
                const budgetsData: BudgetDTO[] = await budgetService.getBudgets();

                const mapped: BudgetWithVariance[] = budgetsData.map((b) => {

                    const account = accountsData.find(
                        (a) => a.accountId === b.accountId
                    );

                    const variance = b.budgetAmount - b.actualAmount;

                    const percentageUsed =
                        b.budgetAmount === 0
                            ? 0
                            : (b.actualAmount / b.budgetAmount) * 100;

                    let status = "UNDER BUDGET";
                    if (percentageUsed > 100) status = "OVER BUDGET";
                    else if (percentageUsed >= 80) status = "ON TRACK";

                    return {
                        ...b,
                        accountName: account ? account.name : `Account ${b.accountId}`,
                        variance,
                        percentageUsed,
                        status,
                    };
                });

                setBudgets(mapped);
                setLoading(false);

            } catch (err) {
                console.error("Failed to load budgets and accounts", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard">
                <Sidebar />
                <main className="main-content">Loading...</main>
            </div>
        );
    }

    // ================= SUMMARY CALCULATIONS =================

    const totalBudget = budgets.reduce((sum, b) => sum + b.budgetAmount, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.actualAmount, 0);
    const overallPercentage =
        totalBudget === 0 ? 0 : (totalActual / totalBudget) * 100;

    const overBudgetItems = budgets.filter(
        (b) => b.percentageUsed > 100
    ).length;

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* ===== HEADER ===== */}
                <header className="page-header">
                    <h1>Variance Dashboard</h1>
                    <div className="page-nav">
                        <a href="/budgetVsActualPage" className="nav-link">Budget Vs Actual</a>
                        <a href="/budget" className="nav-link">Budget</a>
                        <a href="/Variance-details" className="nav-link">Variance Details</a>
                    </div>
                </header>

                {/* ===== SUMMARY CARDS ===== */}
                <section
                    className="card summary-cards"
                    style={{ display: "flex", gap: "15px", marginBottom: "20px" }}
                >
                    <div className="card" style={{ flex: 1, textAlign: "center" }}>
                        <h4>Total Budget</h4>
                        <p>${totalBudget.toLocaleString()}</p>
                    </div>

                    <div className="card" style={{ flex: 1, textAlign: "center" }}>
                        <h4>Total Actual</h4>
                        <p>${totalActual.toLocaleString()}</p>
                    </div>

                    <div className="card" style={{ flex: 1, textAlign: "center" }}>
                        <h4>Actual vs Budget</h4>
                        <p>{overallPercentage.toFixed(2)}%</p>
                    </div>

                    <div className="card" style={{ flex: 1, textAlign: "center" }}>
                        <h4>Over Budget Items</h4>
                        <p>{overBudgetItems}</p>
                    </div>
                </section>

                {/* ===== CHART ===== */}
                <section
                    className="card table-section"
                    style={{ padding: "20px", marginBottom: "20px" }}
                >
                    <h3>Budget vs Actual Chart</h3>

                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={budgets}
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="accountName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="budgetAmount" fill="#007bff" name="Budget" />
                            <Bar dataKey="actualAmount" fill="#28a745" name="Actual" />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* ===== TABLE ===== */}
                <section className="card table-section">
                    <h3>Variance Details Table</h3>

                    <table>
                        <thead>
                        <tr>
                            <th>Account</th>
                            <th>Budget Amount</th>
                            <th>Actual Amount</th>
                            <th>Variance</th>
                            <th>% Used</th>
                            <th>Status</th>
                        </tr>
                        </thead>

                        <tbody>
                        {budgets.map((b) => (
                            <tr key={b.budgetId}>
                                <td>{b.accountName}</td>
                                <td>${b.budgetAmount.toLocaleString()}</td>
                                <td>${b.actualAmount.toLocaleString()}</td>
                                <td>${b.variance.toLocaleString()}</td>
                                <td>{b.percentageUsed.toFixed(2)}%</td>
                                <td>{b.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

            </main>
        </div>
    );
};

export default VarianceDashboardPage;