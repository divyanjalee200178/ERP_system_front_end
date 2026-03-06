import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { financialService } from "../services/financialService";
import type { Account, Transaction, Invoice } from "../types/financialTypes";
import "../styles/financialReports.css";
import { Link } from "react-router-dom";

interface Ratio {
    name: string;
    value: number | string;
    description: string;
}

const FinancialRatiosPage: React.FC = () => {
    const [ratios, setRatios] = useState<Ratio[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAndCalculateRatios = async () => {
            try {
                // Fetch all data
                const accounts: Account[] = await financialService.getAccounts();
                const transactions: Transaction[] = await financialService.getTransactions();
                const invoices: Invoice[] = await financialService.getInvoices();

                // ===================== RATIO CALCULATIONS =====================
                const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);

                const totalLiabilities = transactions
                    .filter(t => t.type === "DEBIT")
                    .reduce((sum, t) => sum + t.amount, 0) * 0.4; // Example approximation

                const equity = totalAssets - totalLiabilities;

                const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);

                const currentRatio = totalAssets / (totalLiabilities || 1);
                const debtToEquity = (totalLiabilities / (equity || 1)).toFixed(2);
                const grossProfitMargin = ((totalRevenue - totalLiabilities) / totalRevenue * 100).toFixed(2) + "%";
                const netProfitMargin = ((totalRevenue - totalLiabilities) / totalRevenue * 100 * 0.4).toFixed(2) + "%";

                setRatios([
                    { name: "Current Ratio", value: currentRatio.toFixed(2), description: "Shows company liquidity" },
                    { name: "Debt to Equity", value: debtToEquity, description: "Shows company leverage" },
                    { name: "Gross Profit Margin", value: grossProfitMargin, description: "Profitability before expenses" },
                    { name: "Net Profit Margin", value: netProfitMargin, description: "Overall profitability" },
                ]);
            } catch (err) {
                console.error("Error fetching financial data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAndCalculateRatios();
    }, []);

    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <header className="page-header">
                    <h1>Financial Ratios</h1>
                    <nav className="page-nav">
                        <Link to="/financial" className="nav-link">Financial Reports</Link>
                        <Link to="/income" className="nav-link">Income</Link>
                        <Link to="/cash" className="nav-link">Cash Flow</Link>
                    </nav>
                </header>

                {/* Ratios Summary Cards */}
                <section className="card dashboard-cards">
                    {ratios.map((r) => (
                        <div key={r.name} className="card-item">
                            <h4>{r.name}</h4>
                            <p>{r.value}</p>
                        </div>
                    ))}
                </section>

                {/* Ratios Table */}
                <section className="card table-section">
                    <h3>Ratio Details</h3>
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Ratio</th>
                            <th>Value</th>
                            <th>Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        {ratios.map((r) => (
                            <tr key={r.name}>
                                <td>{r.name}</td>
                                <td>{r.value}</td>
                                <td>{r.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* Print Button */}
                <section className="balance-summary">
                    <button
                        className="btn print-btn"
                        onClick={() => window.print()}
                    >
                        Print Ratios Report
                    </button>
                </section>
            </main>
        </div>
    );
};

export default FinancialRatiosPage;