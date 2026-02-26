import React, { useEffect, useState } from "react";
import { getAllInvoices } from "../services/accountsReceivableService";
import type { ARInvoiceDTO } from "../types/accountsReceivableTypes";
import Sidebar from "../components/Sidebar";
import "../styles/Invoice.css";

const AccountsReceivable: React.FC = () => {
    const [invoices, setInvoices] = useState<ARInvoiceDTO[]>([]);
    const [totalReceivable, setTotalReceivable] = useState(0);
    const [overdue, setOverdue] = useState(0);
    const [dueThisWeek, setDueThisWeek] = useState(0);
    const [filter, setFilter] = useState<"ALL"|"OVERDUE"|"DUE_THIS_WEEK">("ALL");

    // Calculate summary
    const calculateSummary = (invoiceList: ARInvoiceDTO[]) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        let total = 0;
        let overdueAmount = 0;
        let weekAmount = 0;

        invoiceList.forEach((inv) => {
            const balance = inv.balance ?? 0;
            total += balance;

            const dueDate = new Date(inv.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const isOverdue = dueDate < now || inv.status?.toUpperCase() === "OVERDUE";
            if (isOverdue) overdueAmount += balance;

            if (dueDate >= now && dueDate <= nextWeek) weekAmount += balance;
        });

        setTotalReceivable(total);
        setOverdue(overdueAmount);
        setDueThisWeek(weekAmount);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getAllInvoices();
                setInvoices(data);
                calculateSummary(data);
            } catch (err) {
                console.error("Failed to load Accounts Receivable:", err);
            }
        };
        fetchData();
    }, []);

    // Filtered invoices for table
    const filteredInvoices = invoices.filter((inv) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const dueDate = new Date(inv.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (filter === "OVERDUE") return dueDate < now || inv.status?.toUpperCase() === "OVERDUE";
        if (filter === "DUE_THIS_WEEK") return dueDate >= now && dueDate <= nextWeek;
        return true; // ALL
    });

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <h1>Accounts Receivable</h1>
                </header>

                {/* Summary Cards */}
                <section className="card">
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Total Receivables</label>
                            <div>${totalReceivable.toFixed(2)}</div>
                        </div>
                        <div className="form-field">
                            <label>Overdue</label>
                            <div>${overdue.toFixed(2)}</div>
                        </div>
                        <div className="form-field">
                            <label>Due This Week</label>
                            <div>${dueThisWeek.toFixed(2)}</div>
                        </div>
                        <div className="form-field">
                            <label>Customers</label>
                            <div>{new Set(invoices.map((i) => i.customerName)).size}</div>
                        </div>
                    </div>
                </section>

                {/* Filter Buttons */}
                <section className="card">
                    <div className="filter-buttons">
                        <button onClick={() => setFilter("ALL")}>All</button>
                        <button onClick={() => setFilter("OVERDUE")}>Overdue</button>
                        <button onClick={() => setFilter("DUE_THIS_WEEK")}>Due This Week</button>
                    </div>
                </section>

                {/* Invoice Table */}
                <section className="card table-section">
                    <h3>Customer Invoices</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Invoice No.</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredInvoices.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.customerName}</td>
                                <td>{inv.invoiceNumber}</td>
                                <td>{new Date(inv.date).toLocaleDateString()}</td>
                                <td>{new Date(inv.dueDate).toLocaleDateString()}</td>
                                <td>${inv.amount.toFixed(2)}</td>
                                <td>${inv.balance.toFixed(2)}</td>
                                <td>{inv.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default AccountsReceivable;