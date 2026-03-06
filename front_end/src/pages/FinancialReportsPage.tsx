import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { financialService } from "../services/financialService";
import type { Transaction, Account, Invoice } from "../types/financialTypes";
import "../styles/financialReports.css";

type ReportType = "Balance Sheet" | "Income Statement" | "Cash Flow" | "Ratios" | null;

const FinancialReportsPage: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [openReport, setOpenReport] = useState<ReportType>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setAccounts(await financialService.getAccounts());
                setTransactions(await financialService.getTransactions());
                setInvoices(await financialService.getInvoices());
            } catch (err) {
                console.error("Error fetching financial data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculations
    const totalAssets = accounts.reduce((sum, a) => sum + a.balance, 0);
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);

    const cashInflow = transactions
        .filter(t => t.type === "CREDIT")
        .reduce((sum, t) => sum + t.amount, 0);

    const cashOutflow = transactions
        .filter(t => t.type === "DEBIT")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalLiabilities = cashOutflow * 0.4;
    const equity = totalAssets - totalLiabilities;

    if (loading) return <div className="main-content">Loading...</div>;

    const renderReportContent = () => {
        switch (openReport) {

            case "Balance Sheet":
                return (
                    <>
                        <h3>Assets</h3>

                        <table className="report-table">
                            <thead>
                            <tr>
                                <th>Account</th>
                                <th>Bank</th>
                                <th>Balance</th>
                            </tr>
                            </thead>

                            <tbody>
                            {accounts.map(a => (
                                <tr key={a.accountId}>
                                    <td>{a.name}</td>
                                    <td>{a.bankName}</td>
                                    <td>${a.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <p><strong>Total Assets: ${totalAssets.toLocaleString()}</strong></p>

                        <h3>Liabilities</h3>
                        <p>${totalLiabilities.toLocaleString()}</p>

                        <h3>Equity</h3>
                        <p>${equity.toLocaleString()}</p>
                    </>
                );

            case "Income Statement":
                return (
                    <>
                        <p><strong>Total Revenue: ${totalRevenue.toLocaleString()}</strong></p>

                        <ul>
                            {invoices.map(i => (
                                <li key={i.invoiceId}>
                                    Invoice #{i.invoiceId} - ${i.amount.toLocaleString()} - {i.status}
                                </li>
                            ))}
                        </ul>
                    </>
                );

            case "Cash Flow":
                return (
                    <>
                        <p><strong>Inflow: ${cashInflow.toLocaleString()}</strong></p>
                        <p><strong>Outflow: ${cashOutflow.toLocaleString()}</strong></p>

                        <ul>
                            {transactions.map(t => (
                                <li key={t.transactionId}>
                                    {t.type} - ${t.amount.toLocaleString()} - {t.date}
                                </li>
                            ))}
                        </ul>
                    </>
                );

            case "Ratios":
                return (
                    <>
                        <ul>
                            <li>Current Ratio: 1.5</li>
                            <li>Debt to Equity: 0.8</li>
                            <li>Gross Profit Margin: 45%</li>
                            <li>Net Profit Margin: 18%</li>
                        </ul>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="dashboard">

            <Sidebar />

            <main className="main-content">

                {/* Header */}
                <header className="page-header">
                    <h1>Financial Reports</h1>

                    <nav className="page-nav">
                        <Link to="/income" className="nav-link">Income</Link>
                        <Link to="/cash" className="nav-link">Cash Flow</Link>
                        <Link to="/FinancialRatio" className="nav-link">Financial Ratios</Link>
                    </nav>
                </header>


                {/* Reports Grid */}
                <section className="reports-grid">
                    {["Balance Sheet", "Income Statement", "Cash Flow", "Ratios"].map((type) => (
                        <div
                            key={type}
                            className={`report-card ${type.toLowerCase().replace(" ", "-")}`}
                        >

                            <h3>{type}</h3>

                            <p className="report-desc">
                                {type === "Balance Sheet" && "Snapshot of financial position at a specific date"}
                                {type === "Income Statement" && "Profit and loss for the period"}
                                {type === "Cash Flow" && "Cash inflows and outflows"}
                                {type === "Ratios" && "Key performance indicators"}
                            </p>

                            <button
                                className="btn view-report"
                                onClick={() => setOpenReport(type as ReportType)}
                            >
                                View Report
                            </button>

                        </div>
                    ))}
                </section>


                {/* BALANCE SHEET DISPLAY UNDER CARDS */}
                <section className="balance-sheet-section">

                    <h2>Balance Sheet</h2>

                    <button
                        className="btn print-btn"
                        onClick={() => window.print()}
                    >
                        Print Report
                    </button>

                    <table className="report-table">
                        <thead>
                        <tr>
                            <th>Account</th>
                            <th>Bank</th>
                            <th>Balance</th>
                        </tr>
                        </thead>

                        <tbody>
                        {accounts.map(a => (
                            <tr key={a.accountId}>
                                <td>{a.name}</td>
                                <td>{a.bankName}</td>
                                <td>${a.balance.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="balance-summary">

                        <p><strong>Total Assets:</strong> ${totalAssets.toLocaleString()}</p>

                        <p><strong>Total Liabilities:</strong> ${totalLiabilities.toLocaleString()}</p>

                        <p><strong>Equity:</strong> ${equity.toLocaleString()}</p>

                    </div>

                </section>


                {/* Modal */}
                {openReport && (
                    <div className="modal-overlay" onClick={() => setOpenReport(null)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <h2>{openReport}</h2>

                            {renderReportContent()}

                            <button
                                className="btn close-modal"
                                onClick={() => setOpenReport(null)}
                            >
                                Close
                            </button>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default FinancialReportsPage;