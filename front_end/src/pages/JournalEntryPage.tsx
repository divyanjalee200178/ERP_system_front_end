import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Link } from "react-router-dom";
import {
    getJournals,
    saveJournal,
    updateJournal,
    deleteJournal,
    getInvoices,
    getAccounts,
} from "../services/JournalEntryPage";
import type { JournalEntry, Invoice, Account } from "../services/JournalEntryPage";
import "../styles/journalEntry.css";

// Optional type guard for unknown errors
function isErrorWithMessage(error: unknown): error is { message: string } {
    return typeof error === "object" && error !== null && "message" in error;
}

const JournalEntryPage: React.FC = () => {
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const [selectedJournal, setSelectedJournal] = useState<JournalEntry>({
        id: 0,
        date: "",
        journalNo: "",
        description: "",
        debitTotal: 0,
        creditTotal: 0,
        status: "",
        invoiceId: 0,
        accountId: 0,
    });

    // ===== Load Data on Mount =====
    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            try {
                const journalsData = await getJournals();
                const invoicesData = await getInvoices();
                const accountsData = await getAccounts();

                const mappedJournals: JournalEntry[] = journalsData.map((j) => ({
                    id: j.id ?? 0,
                    journalNo: j.journalNo ?? `J-${j.id ?? 0}`,
                    description: j.description ?? "",
                    debitTotal: j.debitTotal ?? 0,
                    creditTotal: j.creditTotal ?? 0,
                    date: j.date ?? "",
                    status: j.status ?? "",
                    invoiceId: j.invoiceId ?? 0,
                    accountId: j.accountId ?? 0,
                }));

                setJournals(mappedJournals);
                setInvoices(invoicesData);
                setAccounts(accountsData);
            } catch (error: unknown) {
                if (isErrorWithMessage(error)) {
                    console.error("Failed to load journals:", error.message);
                } else {
                    console.error("Failed to load journals:", error);
                }
                alert("Failed to load journals. See console for details.");
            }
        };

        fetchData();
    }, []);

    // ===== Handlers =====
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setSelectedJournal((prev: JournalEntry) => ({
            ...prev,
            [name]:
                name === "debitTotal" ||
                name === "creditTotal" ||
                name === "invoiceId" ||
                name === "accountId"
                    ? parseInt(value, 10)
                    : value,
        }));
    };

    // const handleSave = async (): Promise<void> => {
    //     if (!selectedJournal.description) {
    //         alert("Enter description");
    //         return;
    //     }
    //     if (!selectedJournal.status) {
    //         alert("Select status");
    //         return;
    //     }
    //     if (selectedJournal.accountId === 0) {
    //         alert("Select Account");
    //         return;
    //     }
    //
    //     try {
    //         if (selectedJournal.id && selectedJournal.id !== 0) {
    //             await updateJournal(selectedJournal);
    //         } else {
    //             await saveJournal(selectedJournal);
    //         }
    //
    //         handleClear();
    //         await reloadData();
    //     } catch (error: unknown) {
    //         if (isErrorWithMessage(error)) {
    //             console.error("Save failed:", error.message);
    //         } else {
    //             console.error("Save failed:", error);
    //         }
    //         alert("An error occurred while saving the journal entry.");
    //     }
    // };

    const handleSave = async (): Promise<void> => {

        if (!selectedJournal.description) {
            alert("Enter description");
            return;
        }

        if (!selectedJournal.status) {
            alert("Select status");
            return;
        }

        if (selectedJournal.accountId === 0) {
            alert("Select Account");
            return;
        }

        // ===== Accounting Rule =====
        if (selectedJournal.debitTotal !== selectedJournal.creditTotal) {
            alert("Debit Total and Credit Total must be equal!");
            return;
        }

        try {
            if (selectedJournal.id && selectedJournal.id !== 0) {
                await updateJournal(selectedJournal);
            } else {
                await saveJournal(selectedJournal);
            }

            handleClear();
            await reloadData();

        } catch (error: unknown) {
            if (isErrorWithMessage(error)) {
                console.error("Save failed:", error.message);
            } else {
                console.error("Save failed:", error);
            }
            alert("An error occurred while saving the journal entry.");
        }
    };

    const handleEdit = (journal: JournalEntry): void => setSelectedJournal(journal);

    const handleDelete = async (id: number | undefined): Promise<void> => {
        if (!id) return;
        if (!window.confirm("Are you sure to delete this journal entry?")) return;

        try {
            await deleteJournal(id);
            await reloadData();
        } catch (error: unknown) {
            if (isErrorWithMessage(error)) {
                console.error("Delete failed:", error.message);
            } else {
                console.error("Delete failed:", error);
            }
            alert("An error occurred while deleting the journal entry.");
        }
    };

    const handleClear = (): void => {
        setSelectedJournal({
            id: 0,
            date: "",
            journalNo: "",
            description: "",
            debitTotal: 0,
            creditTotal: 0,
            status: "",
            invoiceId: 0,
            accountId: 0,
        });
    };

    // ===== Reload Data =====
    const reloadData = async (): Promise<void> => {
        try {
            const journalsData = await getJournals();
            const invoicesData = await getInvoices();
            const accountsData = await getAccounts();

            const mappedJournals: JournalEntry[] = journalsData.map((j) => ({
                id: j.id ?? 0,
                journalNo: j.journalNo ?? `J-${j.id ?? 0}`,
                description: j.description ?? "",
                debitTotal: j.debitTotal ?? 0,
                creditTotal: j.creditTotal ?? 0,
                date: j.date ?? "",
                status: j.status ?? "",
                invoiceId: j.invoiceId ?? 0,
                accountId: j.accountId ?? 0,
            }));

            setJournals(mappedJournals);
            setInvoices(invoicesData);
            setAccounts(accountsData);
        } catch (error: unknown) {
            if (isErrorWithMessage(error)) {
                console.error("Reload failed:", error.message);
            } else {
                console.error("Reload failed:", error);
            }
        }
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Journal Entry Management</h1>
                    <nav className="page-nav">
                        <Link to="/trial-balance" className="nav-link">
                            Go to Trial Balance
                        </Link>
                        <Link to="/ledger-details" className="nav-link">
                            Ledger Details
                        </Link>
                    </nav>
                </header>

                <section className="card form-card">
                    <h3>Add / Update Journal Entry</h3>
                    <div className="form-grid">
                        <input type="date" name="date" value={selectedJournal.date} onChange={handleChange} />
                        <input
                            type="text"
                            name="journalNo"
                            placeholder="Journal No."
                            value={selectedJournal.journalNo}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={selectedJournal.description}
                            onChange={handleChange}
                        />
                        <select name="status" value={selectedJournal.status} onChange={handleChange}>
                            <option value="">Select Status</option>
                            <option value="Posted">Posted</option>
                            <option value="Draft">Draft</option>
                            <option value="Pending">Pending</option>
                        </select>
                        <input
                            type="number"
                            name="debitTotal"
                            placeholder="Debit Total"
                            value={selectedJournal.debitTotal}
                            onChange={handleChange}
                        />
                        <input
                            type="number"
                            name="creditTotal"
                            placeholder="Credit Total"
                            value={selectedJournal.creditTotal}
                            onChange={handleChange}
                        />
                        <select name="invoiceId" value={selectedJournal.invoiceId} onChange={handleChange}>
                            <option value={0}>Select Invoice</option>
                            {invoices.map((i) => (
                                <option key={i.id} value={i.id}>
                                    {i.invoiceNumber}
                                </option>
                            ))}
                        </select>
                        <select name="accountId" value={selectedJournal.accountId} onChange={handleChange}>
                            <option value={0}>Select Account</option>
                            {accounts.map((a) => (
                                <option key={a.accountId} value={a.accountId}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="btn-group">
                        <button className="btn primary" onClick={handleSave}>
                            {selectedJournal.id && selectedJournal.id !== 0 ? "Update" : "Save"}
                        </button>
                        <button className="btn warning" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </section>

                <section className="card table-section">
                    <h3>Journal Entries</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Date</th>
                            <th>Journal No.</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Debit Total</th>
                            <th>Credit Total</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {journals.map((j) => (
                            <tr key={j.id}>
                                <td>{j.date}</td>
                                <td>{j.journalNo}</td>
                                <td>{j.description}</td>
                                <td>{j.status}</td>
                                <td>{j.debitTotal}</td>
                                <td>{j.creditTotal}</td>
                                <td>
                                    <button onClick={() => handleEdit(j)}>Edit</button>
                                    <button onClick={() => handleDelete(j.id)}>Delete</button>
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

export default JournalEntryPage;