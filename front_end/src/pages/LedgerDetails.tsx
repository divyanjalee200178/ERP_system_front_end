// src/pages/LedgerDetails.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getJournals, getAccounts } from "../services/JournalEntryPage";
import type { JournalEntry, Account } from "../services/JournalEntryPage";
import "../styles/LedgerDetails.css";

const LedgerDetails: React.FC = () => {
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAccount, setSelectedAccount] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const journalData = await getJournals();
                setJournals(journalData);

                const accountData = await getAccounts();
                setAccounts(accountData);
            } catch (error) {
                console.error("Error loading ledger data:", error);
            }
        };
        fetchData();
    }, []);

    // ===== Filtered Journals =====
    const filteredJournals = journals.filter((journal) => {
        const matchesSearch =
            journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (journal.journalNo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        const matchesAccount = selectedAccount === "" || journal.accountId === selectedAccount;

        const matchesDate = selectedDate === "" || journal.date === selectedDate;

        return matchesSearch && matchesAccount && matchesDate;
    });

    // ===== Summary Cards Data =====
    const totalEntries = filteredJournals.length;
    const unpostedEntries = filteredJournals.filter(j => j.status !== "Posted").length;

    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();
    const entriesThisMonth = filteredJournals.filter(j => {
        const date = new Date(j.date);
        return date.getMonth() + 1 === thisMonth && date.getFullYear() === thisYear;
    }).length;

    const totalDebit = filteredJournals.reduce((sum, j) => sum + j.debitTotal, 0);
    const totalCredit = filteredJournals.reduce((sum, j) => sum + j.creditTotal, 0);

    // ===== Clear Filters =====
    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedAccount("");
        setSelectedDate("");
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">
                {/* ===== Header with Navigation ===== */}
                <header className="page-header">
                    <h1>Ledger Details</h1>
                    <nav className="page-nav">
                        <Link to="/journal-entry" className="nav-link">Journal Entry</Link>
                        <Link to="/trial-balance" className="nav-link">Trial Balance</Link>
                        <Link to="/ledger-details" className="nav-link active">Ledger Details</Link>
                    </nav>
                </header>

                {/* ===== Summary Cards ===== */}
                <section className="summary-cards">
                    <div className="card-item">
                        <h4>Total Journal Entries</h4>
                        <p>{totalEntries}</p>
                    </div>
                    <div className="card-item">
                        <h4>Unposted Entries</h4>
                        <p>{unpostedEntries}</p>
                    </div>
                    <div className="card-item">
                        <h4>This Month</h4>
                        <p>{entriesThisMonth}</p>
                    </div>
                    <div className="card-item">
                        <h4>Debit/Credit Balance</h4>
                        <p>${totalDebit.toFixed(2)} / ${totalCredit.toFixed(2)}</p>
                    </div>
                </section>

                {/* ===== Filters ===== */}
                <section className="card form-card">
                    <div className="ledger-filters">
                        <input
                            type="text"
                            placeholder="Search ledger entries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={selectedAccount}
                            onChange={(e) =>
                                setSelectedAccount(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        >
                            <option value="">Select Account</option>
                            {accounts.map((acc) => (
                                <option key={acc.accountId} value={acc.accountId}>
                                    {acc.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />

                        <button className="btn clear-btn" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>
                </section>

                {/* ===== Ledger Table ===== */}
                <section className="card table-section">
                    <div className="ledger-table-wrapper">
                        <table className="ledger-table">
                            <thead>
                            <tr>
                                <th>Date</th>
                                <th>Account</th>
                                <th>Journal No.</th>
                                <th>Debit</th>
                                <th>Credit</th>
                                <th>Balance</th>
                                <th>Description</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredJournals.length > 0 ? (
                                filteredJournals.map((journal) => {
                                    const accountName =
                                        accounts.find((a) => a.accountId === journal.accountId)?.name || "N/A";
                                    const balance = journal.debitTotal - journal.creditTotal;
                                    const journalNumber = journal.journalNo ?? `J-${journal.id ?? 0}`;

                                    return (
                                        <tr key={journal.id}>
                                            <td>{journal.date}</td>
                                            <td>{accountName}</td>
                                            <td>{journalNumber}</td>
                                            <td className="debit">{journal.debitTotal.toFixed(2)}</td>
                                            <td className="credit">{journal.creditTotal.toFixed(2)}</td>
                                            <td className="balance">{balance.toFixed(2)}</td>
                                            <td>{journal.description}</td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="no-data">
                                        No ledger entries found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default LedgerDetails;