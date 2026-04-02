// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard-advanced.css";

import { userService } from "../services/userService";
import { supplierService } from "../services/SupplierService";
import { getAccounts, getJournals } from "../services/JournalEntryPage";

import type { UserDTO } from "../types/UserTypes";
import type { SupplierDTO } from "../types/supplierTypes";
import type { Account, JournalEntry } from "../services/JournalEntryPage";

// Chart imports
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface TrialRow {
    accountName: string;
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
}

const DashboardPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [trialData, setTrialData] = useState<TrialRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    /* ================= LOAD DATA ================= */
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async (): Promise<void> => {
        try {
            const userData = await userService.getUsers();
            setUsers(userData);

            const supplierData = await supplierService.getAll();
            setSuppliers(supplierData);

            const accountData = await getAccounts();
            setAccounts(accountData);

            const journalData = await getJournals();
            setJournals(journalData);

            // Prepare trial data for charts
            const rows: TrialRow[] = accountData.map((acc) => {
                const accountJournals = journalData.filter(
                    (j) => j.accountId === acc.accountId
                );
                const debitTotal = accountJournals.reduce(
                    (sum, j) => sum + (j.debitTotal ?? 0),
                    0
                );
                const creditTotal = accountJournals.reduce(
                    (sum, j) => sum + (j.creditTotal ?? 0),
                    0
                );
                return {
                    accountName: acc.name,
                    debitBalance: debitTotal,
                    creditBalance: creditTotal,
                    netBalance: debitTotal - creditTotal,
                };
            });

            setTrialData(rows);
        } catch (error) {
            console.error("Dashboard load error:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ================= CALCULATIONS ================= */
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "Active").length;
    const totalSuppliers = suppliers.length;
    const totalAccounts = accounts.length;
    const totalBalance = trialData.reduce((sum, r) => sum + r.netBalance, 0);
    const totalJournals = journals.length;
    const activeUserPercentage =
        totalUsers === 0 ? 0 : ((activeUsers / totalUsers) * 100).toFixed(1);

    /* ================= CHART DATA ================= */
    const usersChartData = {
        labels: ["Active", "Inactive"],
        datasets: [
            {
                label: "Users",
                data: [activeUsers, totalUsers - activeUsers],
                backgroundColor: ["#4facfe", "#d3d3d3"],
            },
        ],
    };

    const accountsChartData = {
        labels: trialData.map((r) => r.accountName),
        datasets: [
            {
                label: "Net Balance",
                data: trialData.map((r) => r.netBalance),
                backgroundColor: trialData.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 50%)`),
            },
        ],
    };

    if (loading) return <div className="main-content">Loading Dashboard...</div>;

    /* ================= UI ================= */
    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Hotel Management Dashboard</h1>
                    <span>Real-Time System Overview</span>
                </header>

                {/* ===== CARDS ===== */}
                <section className="stats-grid small-cards">
                    <div className="stat-card blue">
                        <div className="card-badge">{activeUsers} Active</div>
                        <h4>Total Users</h4>
                        <h2>{totalUsers}</h2>
                        <p>All system users</p>
                    </div>

                    <div className="stat-card green">
                        <div className="card-badge">{totalSuppliers} Registered</div>
                        <h4>Suppliers</h4>
                        <h2>{totalSuppliers}</h2>
                        <p>Suppliers in system</p>
                    </div>

                    <div className="stat-card purple">
                        <div className="card-badge">{totalAccounts} Accounts</div>
                        <h4>Accounts</h4>
                        <h2>{totalAccounts}</h2>
                        <p>Financial accounts</p>
                    </div>

                    <div className="stat-card orange">
                        <div className="card-badge">${totalBalance.toLocaleString()}</div>
                        <h4>Total Net Balance</h4>
                        <h2>${totalBalance.toLocaleString()}</h2>
                        <p>Financial overview</p>
                    </div>

                    <div className="stat-card dark">
                        <div className="card-badge">{totalJournals}</div>
                        <h4>Journal Entries</h4>
                        <h2>{totalJournals}</h2>
                        <p>Transactions recorded</p>
                    </div>

                    <div className="stat-card light-blue">
                        <div className="card-badge">{activeUserPercentage}%</div>
                        <h4>Active Users %</h4>
                        <h2>{activeUserPercentage}%</h2>
                        <p>System engagement</p>
                    </div>
                </section>

                {/* ===== CHARTS ===== */}
                <section className="stats-grid charts-grid">
                    <div className="card">
                        <h4>User Status Distribution</h4>
                        <Doughnut data={usersChartData} />
                    </div>

                    <div className="card">
                        <h4>Accounts Net Balances</h4>
                        <Bar
                            data={accountsChartData}
                            options={{
                                responsive: true,
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardPage;