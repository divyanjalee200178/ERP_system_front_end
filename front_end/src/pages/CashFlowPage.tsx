import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { financialService } from "../services/financialService";
import type { Transaction } from "../types/financialTypes";
import "../styles/financialReports.css";
import {Link} from "react-router-dom";

const CashFlowPage: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const txnData = await financialService.getTransactions();
                // Sort transactions by transactionId ascending
                const sortedTxn = txnData.sort((a, b) => a.transactionId - b.transactionId);
                setTransactions(sortedTxn);
            } catch (error) {
                console.error("Error fetching transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ===================== CASH FLOW CALCULATIONS =====================
    const cashInflow = transactions
        .filter((t) => t.type === "CREDIT")
        .reduce((sum, t) => sum + t.amount, 0);

    const cashOutflow = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0);

    const netCashFlow = cashInflow - cashOutflow;

    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                {/* Header */}
                <header className="page-header">
                    <h1>Statement of Cash Flows</h1>
                    <nav className="page-nav">
                        <Link to="/financial" className="nav-link">Financial Reports</Link>
                        <Link to="/income" className="nav-link">Income</Link>
                        <Link to="/FinancialRatio" className="nav-link">Financial Ratios</Link>
                    </nav>
                </header>

                {/* Summary Cards */}
                <section className="card dashboard-cards">
                    <div className="card-item">
                        <h4>Cash Inflow</h4>
                        <p>${cashInflow.toLocaleString()}</p>
                    </div>
                    <div className="card-item">
                        <h4>Cash Outflow</h4>
                        <p>${cashOutflow.toLocaleString()}</p>
                    </div>
                    <div className="card-item">
                        <h4>Net Cash Flow</h4>
                        <p>${netCashFlow.toLocaleString()}</p>
                    </div>
                </section>

                {/* Cash Flow Table */}
                <section className="card table-section">
                    <h3>Transactions</h3>
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Reference</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((t) => (
                            <tr key={t.transactionId}>
                                <td>{t.transactionId}</td>
                                <td>{t.type}</td>
                                <td>${t.amount.toLocaleString()}</td>
                                <td>
                                    {t.date ? new Date(t.date).toLocaleString() : "-"}
                                </td>
                                <td>{t.reference || "-"}</td>
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
                        Print Cash Flow Statement
                    </button>
                </section>
            </main>
        </div>
    );
};

export default CashFlowPage;