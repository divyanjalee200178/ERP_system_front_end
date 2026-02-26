import React, { useEffect, useState } from "react";
import { getAllInvoices } from "../services/accountsPayableService";
import type { Invoice } from "../types/accountsPayableTypes";
import Sidebar from "../components/Sidebar";
import "../styles/Invoice.css";

const AccountsPayable: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [totalDue, setTotalDue] = useState(0);
    const [overdue, setOverdue] = useState(0);
    const [dueThisWeek, setDueThisWeek] = useState(0);

    const calculateSummary = (invoiceList: Invoice[]) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0); // remove time effect

        let total = 0;
        let overdueAmount = 0;
        let weekAmount = 0;

        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        invoiceList.forEach((inv) => {
            total += inv.amount;

            const dueDate = new Date(inv.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const isOverdueByDate = dueDate < now;
            const isOverdueByStatus =
                inv.status?.toUpperCase() === "OVERDUE";

            // ✅ Hybrid Logic
            if (isOverdueByDate || isOverdueByStatus) {
                overdueAmount += inv.amount;
            }

            if (dueDate >= now && dueDate <= nextWeek) {
                weekAmount += inv.amount;
            }
        });

        setTotalDue(total);
        setOverdue(overdueAmount);
        setDueThisWeek(weekAmount);
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllInvoices();
            setInvoices(data);
            calculateSummary(data);
        };

        fetchData();
    }, []);

    // ✅ Auto display status (optional improvement)
    const getDisplayStatus = (inv: Invoice) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const dueDate = new Date(inv.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate < now) return "OVERDUE";
        return inv.status;
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <h1>Accounts Payable</h1>
                </header>

                {/* Summary Cards */}
                <section className="card">
                    <div className="form-grid">
                        <div className="form-field">
                            <label>Total Due</label>
                            <div>${totalDue.toFixed(2)}</div>
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
                            <label>Vendors</label>
                            <div>
                                {new Set(invoices.map(i => i.supplierName)).size}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Table Section */}
                <section className="card table-section">
                    <h3>Invoice Records</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Invoice No.</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {invoices.map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.supplierName}</td>
                                <td>{inv.invoiceNumber}</td>
                                <td>{inv.date}</td>
                                <td>{inv.dueDate}</td>
                                <td>${inv.amount.toFixed(2)}</td>
                                <td>{getDisplayStatus(inv)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default AccountsPayable;