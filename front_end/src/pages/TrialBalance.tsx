// src/pages/TrialBalance.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getJournals, getAccounts } from "../services/JournalEntryPage";
import type { JournalEntry, Account } from "../services/JournalEntryPage";
import "../styles/trialBalance.css";

interface TrialRow {
    accountName: string;
    debitBalance: number;
    creditBalance: number;
    netBalance: number;
}

const TrialBalance: React.FC = () => {
    const [trialData, setTrialData] = useState<TrialRow[]>([]);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const journalsData: JournalEntry[] = await getJournals();
                const accountsData: Account[] = await getAccounts();

                const rows: TrialRow[] = accountsData.map((acc) => {
                    const accountJournals = journalsData.filter(
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

                const debitSum = rows.reduce((sum, r) => sum + r.debitBalance, 0);
                const creditSum = rows.reduce((sum, r) => sum + r.creditBalance, 0);

                setTotalDebit(debitSum);
                setTotalCredit(creditSum);
            } catch (error) {
                console.error("Error loading trial balance:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">

                {/* ===== Header with Navigation ===== */}
                <header className="page-header">
                    <h1>Trial Balance</h1>
                    <nav className="page-nav">
                        <Link to="/journal-entry" className="nav-link">
                            Journal Entry
                        </Link>
                        <Link to="/trial-balance" className="nav-link active">
                            Trial Balance
                        </Link>
                        <Link to="/ledger-details" className="nav-link">
                            Ledger Details
                        </Link>
                    </nav>
                </header>

                {/* ===== Trial Balance Table ===== */}
                <section className="card table-section">
                    <h3>Accounts Trial Balance</h3>

                    <table className="trial-table">
                        <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Debit Balance</th>
                            <th>Credit Balance</th>
                            <th>Net Balance</th>
                        </tr>
                        </thead>

                        <tbody>
                        {trialData.length === 0 && (
                            <tr>
                                <td colSpan={4} className="no-data">
                                    No Data Found
                                </td>
                            </tr>
                        )}

                        {trialData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.accountName}</td>
                                <td className="debit">
                                    {row.debitBalance.toFixed(2)}
                                </td>
                                <td className="credit">
                                    {row.creditBalance.toFixed(2)}
                                </td>
                                <td className="net">
                                    {row.netBalance.toFixed(2)}
                                </td>
                            </tr>
                        ))}

                        {trialData.length > 0 && (
                            <tr className="total-row">
                                <td>Total</td>
                                <td>{totalDebit.toFixed(2)}</td>
                                <td>{totalCredit.toFixed(2)}</td>
                                <td>{(totalDebit - totalCredit).toFixed(2)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </section>

            </main>
        </div>
    );
};

export default TrialBalance;
