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

interface BudgetWithAccount extends BudgetDTO {
    accountName: string;
}

const BudgetVsActualPage: React.FC = () => {

    const [budgets, setBudgets] = useState<BudgetWithAccount[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {

        const fetchData = async () => {
            try {
                const accountsData: AccountDTO[] = await budgetService.getAccounts();
                const budgetsData: BudgetDTO[] = await budgetService.getBudgets();

                // Map account name correctly (name field)
                const mappedBudgets: BudgetWithAccount[] = budgetsData.map((b) => ({
                    ...b,
                    accountName:
                        accountsData.find((a) => a.accountId === b.accountId)?.name || "Unknown",
                }));

                setBudgets(mappedBudgets);
                setLoading(false);
            } catch (error) {
                console.error("Failed to load budgets and accounts", error);
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

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* ===== HEADER ===== */}
                <header className="page-header">
                    <h1>Budgeting</h1>
                    <div className="page-nav">
                        <a href="/budgetVsActualPage" className="nav-link">Budget Vs Actual</a>
                        <a href="/budget" className="nav-link">Budget</a>
                        <a href="/Variance-details" className="nav-link">Variance Details</a>
                    </div>
                </header>

                {/* ===== CHART SECTION ===== */}
                <section className="card table-section" style={{ padding: "20px" }}>
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

            </main>
        </div>
    );
};

export default BudgetVsActualPage;