import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import type { TransactionDTO, AccountDTO } from "../types/bankType";
import { bankService } from "../services/bankService";
import "../styles/bank.css";
import {Link} from "react-router-dom";

interface CartItem {
    transactionId: number;
    bankAccount: string;
    finalAmount: number;
}

const TransactionPage: React.FC = () => {
    const emptyTransaction: TransactionDTO = {
        transactionId: 0,
        bankAccount: "",
        type: "CREDIT",
        reference: "",
        accountId: 0,
        date: new Date().toISOString(),
        amount: 0
    };

    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [accounts, setAccounts] = useState<AccountDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTransaction, setCurrentTransaction] =
        useState<TransactionDTO>(emptyTransaction);

    const [cart, setCart] = useState<CartItem[]>([]);

    // ================= FETCH DATA =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const txnData = await bankService.getTransactions();
                const accData = await bankService.getAccounts();

                const safeTransactions: TransactionDTO[] = txnData.map((t) => ({
                    transactionId: t.transactionId,
                    bankAccount: t.bankAccount,
                    type: t.type,
                    reference: t.reference,
                    accountId: t.accountId,
                    date: t.date ?? new Date().toISOString(),
                    amount: t.amount ?? 0
                }));

                setTransactions(safeTransactions);
                setAccounts(accData);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ================= EDIT =================
    const handleEdit = (txn: TransactionDTO) => {
        setCurrentTransaction(txn);
        setIsEditing(true);
        setShowModal(true);
    };

    // ================= DELETE =================
    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this transaction?")) return;

        try {
            await bankService.deleteTransaction(id);
            setTransactions(transactions.filter((t) => t.transactionId !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    // ================= SAVE =================
    const handleSaveTransaction = async () => {
        if (!currentTransaction.bankAccount) {
            alert("Please select account");
            return;
        }

        try {
            if (isEditing) {
                await bankService.updateTransaction(currentTransaction);
            } else {
                await bankService.saveTransaction(currentTransaction);
            }

            const updated = await bankService.getTransactions();
            const safeUpdated: TransactionDTO[] = updated.map((t) => ({
                transactionId: t.transactionId,
                bankAccount: t.bankAccount,
                type: t.type,
                reference: t.reference,
                accountId: t.accountId,
                date: t.date ?? new Date().toISOString(),
                amount: t.amount ?? 0
            }));

            setTransactions(safeUpdated);
            setCurrentTransaction(emptyTransaction);
            setIsEditing(false);
            setShowModal(false);
        } catch (error) {
            console.error("Save failed", error);
        }
    };

    // ================= CART =================
    const addToCart = (txn: TransactionDTO) => {
        const account = accounts.find((a) => a.accountId === txn.accountId);
        const initialBalance = account?.balance ?? 0;
        const finalAmount = initialBalance + txn.amount;

        setCart((prev) => [
            ...prev.filter((c) => c.transactionId !== txn.transactionId),
            {
                transactionId: txn.transactionId,
                bankAccount: txn.bankAccount,
                finalAmount: finalAmount
            }
        ]);
    };

    // ================= SUMMARY DATA =================
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount ?? 0), 0);

    // LOCAL unreconciled logic (all transactions considered unreconciled)
    const unreconciledTransactions = transactions; // Or filter if you have a flag in the DTO
    const totalUnreconciledItems = unreconciledTransactions.length;
    const totalUnreconciledAmount = unreconciledTransactions.reduce(
        (sum, t) => sum + (t.amount ?? 0),
        0
    );

    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Transactions</h1>
                    <div className="header-actions">
                        <button
                            className="btn primary"
                            onClick={() => {
                                setShowModal(true);
                                setIsEditing(false);
                                setCurrentTransaction(emptyTransaction);
                            }}
                        >
                            Add Transaction
                        </button>

                        <Link to="/bank-reconciliation" className="nav-link">Bank Reconciliation</Link>
                    </div>
                </header>

                {/* SUMMARY CARDS */}
                <section className="card dashboard-cards">
                    <div className="card-item">
                        <h4>Total Transactions</h4>
                        <p>{totalTransactions}</p>
                    </div>

                    <div className="card-item">
                        <h4>Total Amount</h4>
                        <p>${totalAmount.toFixed(2)}</p>
                    </div>

                    <div className="card-item">
                        <h4>Unreconciled Items</h4>
                        <p>{totalUnreconciledItems}</p>
                    </div>

                    <div className="card-item">
                        <h4>Total Unreconciled Amount</h4>
                        <p>${totalUnreconciledAmount.toFixed(2)}</p>
                    </div>
                </section>

                {/* TABLE */}
                <section className="card table-section">
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Bank Account</th>
                            <th>Type</th>
                            <th>Reference</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.transactionId}>
                                <td>{txn.transactionId}</td>
                                <td>{txn.bankAccount}</td>
                                <td>{txn.type}</td>
                                <td>{txn.reference}</td>
                                <td>{txn.amount.toFixed(2)}</td>
                                <td>{txn.date ? new Date(txn.date).toLocaleString() : "-"}</td>
                                <td>
                                    <button
                                        className="btn secondary"
                                        onClick={() => handleEdit(txn)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn danger"
                                        onClick={() => handleDelete(txn.transactionId)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="btn success"
                                        onClick={() => addToCart(txn)}
                                    >
                                        Add to Cart
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {/* CART */}
                {cart.length > 0 && (
                    <section className="card table-section">
                        <h3>Cart</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>Bank Account</th>
                                <th>Final Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {cart.map((item) => (
                                <tr key={item.transactionId}>
                                    <td>{item.bankAccount}</td>
                                    <td>${item.finalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                )}

                {/* MODAL */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{isEditing ? "Update Transaction" : "Add Transaction"}</h3>

                            <div className="form-group">
                                <label>Bank Account</label>
                                <select
                                    value={currentTransaction.bankAccount}
                                    onChange={(e) => {
                                        const selectedAccount = accounts.find(
                                            (acc) => acc.bankName === e.target.value
                                        );
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            bankAccount: e.target.value,
                                            accountId: selectedAccount?.accountId ?? 0
                                        });
                                    }}
                                >
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.accountId} value={acc.bankName}>
                                            {acc.name} ({acc.bankName})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Type</label>
                                <select
                                    value={currentTransaction.type}
                                    onChange={(e) =>
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            type: e.target.value as "CREDIT" | "DEBIT"
                                        })
                                    }
                                >
                                    <option value="CREDIT">CREDIT</option>
                                    <option value="DEBIT">DEBIT</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Reference</label>
                                <input
                                    type="text"
                                    value={currentTransaction.reference}
                                    onChange={(e) =>
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            reference: e.target.value
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    type="number"
                                    value={currentTransaction.amount}
                                    onChange={(e) =>
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            amount: Number(e.target.value)
                                        })
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Date</label>
                                <input
                                    type="datetime-local"
                                    value={currentTransaction.date?.slice(0, 16)}
                                    onChange={(e) =>
                                        setCurrentTransaction({
                                            ...currentTransaction,
                                            date: new Date(e.target.value).toISOString()
                                        })
                                    }
                                />
                            </div>

                            <div className="modal-actions">
                                <button className="btn primary" onClick={handleSaveTransaction}>
                                    {isEditing ? "Update" : "Save"}
                                </button>

                                <button
                                    className="btn secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TransactionPage;