// src/pages/BankReconciliationPage.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import type { AccountDTO, TransactionDTO } from "../types/bankType";
import { bankService } from "../services/bankService";
import "../styles/bank.css";

const BankReconciliationPage: React.FC = () => {
    const emptyAccount: AccountDTO = {
        accountId: 0,
        accountCode: "",
        name: "",
        type: "",
        bankName: "",
        balance: 0,
        status: "ACTIVE",
        lastUpdated: undefined
    };

    const [accounts, setAccounts] = useState<AccountDTO[]>([]);
    const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newAccount, setNewAccount] = useState<AccountDTO>(emptyAccount);

    // ================= FETCH =================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accData = await bankService.getAccounts();
                const txnData = await bankService.getTransactions();
                setAccounts(accData);
                setTransactions(txnData);
            } catch (error) {
                console.error("Error loading data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ================= RECONCILE =================
    const handleReconcile = async (account: AccountDTO) => {
        const amountStr = prompt("Enter transaction amount:");
        const typeStr = prompt("Enter type: CREDIT or DEBIT");

        if (!amountStr || !typeStr) return;

        const amount = Number(amountStr);
        const type = typeStr.toUpperCase() as "CREDIT" | "DEBIT";

        const newTransaction: TransactionDTO = {
            transactionId: 0, // backend will generate
            bankAccount: account.bankName,
            type,
            reference: `${type} for ${account.name}`,
            accountId: account.accountId,
            date: new Date().toISOString(),
            amount,
        };

        try {
            await bankService.saveTransaction(newTransaction); // save transaction
            const updatedTransactions = await bankService.getTransactions();
            setTransactions(updatedTransactions);

            alert(`${type} transaction of ${amount} saved for ${account.name}`);
        } catch (error) {
            console.error("Failed to save transaction", error);
            alert("Failed to save transaction");
        }
    };

    // ================= EDIT / DELETE / SAVE =================
    const handleEdit = (account: AccountDTO) => {
        setNewAccount(account);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (accountId: number) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;
        try {
            await bankService.deleteAccount(accountId);
            const updatedAccounts = await bankService.getAccounts();
            setAccounts(updatedAccounts);
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete account");
        }
    };

    const handleSaveAccount = async () => {
        if (!newAccount.name || !newAccount.accountCode) {
            alert("Please fill required fields");
            return;
        }
        try {
            if (isEditing) {
                await bankService.updateAccount(newAccount);
            } else {
                await bankService.saveAccount(newAccount);
            }
            const updatedAccounts = await bankService.getAccounts();
            setAccounts(updatedAccounts);
            setNewAccount(emptyAccount);
            setIsEditing(false);
            setShowModal(false);
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save account");
        }
    };

    const totalAccounts = accounts.length;
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const unreconciledItems = transactions.length;
    const lastReconciliation = accounts.reduce((latest, acc) => {
        if (!acc.lastUpdated) return latest;
        return new Date(acc.lastUpdated) > new Date(latest) ? acc.lastUpdated : latest;
    }, "2023-01-01");

    if (loading) return <div className="main-content">Loading...</div>;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>Bank & Reconciliation</h1>
                    <div className="header-actions">
                        <button className="btn primary" onClick={() => { setShowModal(true); setIsEditing(false); setNewAccount(emptyAccount); }}>Add Account</button>
                        <a href="/transaction" className="btn info">Transaction</a>
                        {/*<a href="/Variance-details" className="btn info">Variance Details</a>*/}
                    </div>
                </header>

                <section className="card dashboard-cards">
                    <div className="card-item">
                        <h4>Total Bank Balance</h4>
                        <p>${totalBalance.toFixed(2)}</p>
                    </div>
                    <div className="card-item">
                        <h4>Unreconciled Items</h4>
                        <p>{unreconciledItems}</p>
                    </div>
                    <div className="card-item">
                        <h4>Last Reconciliation</h4>
                        <p>{new Date(lastReconciliation).toLocaleDateString()}</p>
                    </div>
                    <div className="card-item">
                        <h4>Bank Accounts</h4>
                        <p>{totalAccounts}</p>
                    </div>
                </section>

                <section className="card table-section">
                    <table>
                        <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Bank Name</th>
                            <th>Account Code</th>
                            <th>Type</th>
                            <th>Balance</th>
                            <th>Last Updated</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {accounts.map(account => (
                            <tr key={account.accountId}>
                                <td>{account.name}</td>
                                <td>{account.bankName}</td>
                                <td>{account.accountCode}</td>
                                <td>{account.type}</td>
                                <td>{account.balance.toFixed(2)}</td>
                                <td>{account.lastUpdated ? new Date(account.lastUpdated).toLocaleString() : "-"}</td>
                                <td>{account.status}</td>
                                <td>
                                    <button className="btn primary" onClick={() => handleReconcile(account)}>Reconcile</button>
                                    <button className="btn secondary" onClick={() => handleEdit(account)}>Update</button>
                                    <button className="btn danger" onClick={() => handleDelete(account.accountId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>{isEditing ? "Update Account" : "Add New Account"}</h3>
                            <div className="form-group">
                                <label>Account Name</label>
                                <input type="text" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Account Code</label>
                                <input type="text" value={newAccount.accountCode} onChange={e => setNewAccount({ ...newAccount, accountCode: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input type="text" value={newAccount.bankName} onChange={e => setNewAccount({ ...newAccount, bankName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Balance</label>
                                <input type="number" value={newAccount.balance} onChange={e => setNewAccount({ ...newAccount, balance: Number(e.target.value) })} />
                            </div>
                            <div className="form-group">
                                <label>Account Type</label>
                                <input type="text" value={newAccount.type} onChange={e => setNewAccount({ ...newAccount, type: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn primary" onClick={handleSaveAccount}>{isEditing ? "Update" : "Save"}</button>
                                <button className="btn secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BankReconciliationPage;