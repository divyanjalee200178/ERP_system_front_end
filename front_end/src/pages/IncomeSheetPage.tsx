import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { incomeService } from "../services/incomeService";
import type { IncomeInvoice, ExpenseTransaction } from "../types/incomeTypes";
import "../styles/financialReports.css";

const IncomeSheetPage: React.FC = () => {
    const [invoices, setInvoices] = useState<IncomeInvoice[]>([]);
    const [transactions, setTransactions] = useState<ExpenseTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const invoiceData = await incomeService.getInvoices();
                const transactionData = await incomeService.getTransactions();
                setInvoices(invoiceData);
                setTransactions(transactionData);
            } catch (error) {
                console.error("Error loading income statement data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = transactions
        .filter((t) => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0);
    const netProfit = totalRevenue - totalExpenses;

    if (loading) return <div className="main-content">Loading Income Statement...</div>;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Income Statement</h1>
                    <nav className="page-nav">
                        <Link to="/financial" className="nav-link">Financial Reports</Link>
                        <Link to="/cash" className="nav-link">Cash Flow</Link>
                        <Link to="/FinancialRatio" className="nav-link">Financial Ratios</Link>
                    </nav>
                </header>

                <div style={{ margin: "20px 0" }}>
                    <button className="btn print-btn" onClick={() => window.print()}>Print Report</button>
                </div>

                <section className="balance-sheet-section">
                    <h2>Revenue</h2>
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((i) => (
                            <tr key={i.id}>
                                <td>{i.id}</td>
                                <td>{i.date ? new Date(i.date).toLocaleDateString() : "N/A"}</td>
                                <td>${i.amount.toLocaleString()}</td>
                                <td>{i.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section className="balance-sheet-section">
                    <h2>Expenses</h2>
                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.filter((t) => t.type === "DEBIT").map((t) => (
                            <tr key={t.transactionId}>
                                <td>{t.transactionId}</td>
                                <td>{t.date ? new Date(t.date).toLocaleDateString() : "N/A"}</td>
                                <td>{t.type}</td>
                                <td>${t.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                <section className="balance-summary">
                    <p><strong>Total Revenue:</strong> ${totalRevenue.toLocaleString()}</p>
                    <p><strong>Total Expenses:</strong> ${totalExpenses.toLocaleString()}</p>
                    <p><strong>Net Profit:</strong> ${netProfit.toLocaleString()}</p>
                </section>
            </main>
        </div>
    );
};

export default IncomeSheetPage;