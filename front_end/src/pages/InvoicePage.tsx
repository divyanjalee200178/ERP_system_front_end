import React, { useEffect, useState } from "react";
import "../styles/Invoice.css";
import { invoiceService } from "../services/invoiceService";
import type { InvoiceDTO, PurchaseOrder, SupplierDTO } from "../types/invoiceTypes";
import Sidebar from "../components/Sidebar";

const InvoicePage: React.FC = () => {
    const [invoices, setInvoices] = useState<InvoiceDTO[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
    const [formData, setFormData] = useState<InvoiceDTO>({
        id: 0,
        invoiceNumber: "",
        date: "",
        dueDate: "",
        amount: 0,
        taxRate: 0,
        discount: 0,
        status: "",
        currency: "",
        supplierId: 0,
        purchaseOrderId: 0,
    });
    const [isEditing, setIsEditing] = useState(false);

    const formatDate = (d?: string | Date) => {
        if (!d) return "";
        if (typeof d === "string") return d.split("T")[0];
        return d.toISOString().split("T")[0];
    };

    // ===== Load all data safely in useEffect =====
    useEffect(() => {
        const fetchData = async () => {
            const supplierData = await invoiceService.getSuppliers();
            const poData = await invoiceService.getPurchaseOrders();
            const invData = await invoiceService.getAll();

            // Set state only after all fetches finish
            setSuppliers(supplierData);
            setPurchaseOrders(poData);
            setInvoices(invData);
        };

        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "amount" ||
                name === "taxRate" ||
                name === "discount" ||
                name === "purchaseOrderId" ||
                name === "supplierId"
                    ? parseFloat(value)
                    : value,
        }));
    };

    const handleSave = async () => {
        if (!formData.purchaseOrderId) { alert("Please select a Purchase Order"); return; }
        if (!formData.supplierId) { alert("Please select a Supplier"); return; }

        // Only include dueDate if not empty to match InvoiceDTO type
        const payload: InvoiceDTO = { ...formData };
        if (!payload.dueDate) delete payload.dueDate;

        await invoiceService.saveInvoice(payload);
        const updated = await invoiceService.getAll();
        setInvoices(updated); // reload invoices to get auto-calculated dueDate
        clearForm();
    };

    const handleUpdate = async () => {
        if (!formData.purchaseOrderId) { alert("Please select a Purchase Order"); return; }
        if (!formData.supplierId) { alert("Please select a Supplier"); return; }
        if (!formData.id || formData.id <= 0) return;

        const payload: InvoiceDTO = { ...formData };
        if (!payload.dueDate) delete payload.dueDate;

        await invoiceService.updateInvoice(payload);
        const updated = await invoiceService.getAll();
        setInvoices(updated);
        clearForm();
    };

    const handleEdit = (inv: InvoiceDTO) => {
        setFormData({
            ...inv,
            date: formatDate(inv.date),
            dueDate: inv.dueDate ? formatDate(inv.dueDate) : "",
        });
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        await invoiceService.deleteInvoice(id);
        const updated = await invoiceService.getAll();
        setInvoices(updated);
    };

    const clearForm = () => {
        setFormData({
            id: 0,
            invoiceNumber: "",
            date: "",
            dueDate: "",
            amount: 0,
            taxRate: 0,
            discount: 0,
            status: "",
            currency: "",
            supplierId: 0,
            purchaseOrderId: 0,
        });
        setIsEditing(false);
    };

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="top-bar">
                    <h1>Invoice Management</h1>
                </header>

                <section className="card form-card">
                    <h3>Add / Update Invoice</h3>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="invoiceNumber">Invoice Number</label>
                            <input
                                id="invoiceNumber"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                placeholder="Enter Invoice Number"
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="date">Invoice Date</label>
                            <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="dueDate">Due Date (auto-calculate)</label>
                            <input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="amount">Amount</label>
                            <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="taxRate">Tax Rate</label>
                            <input type="number" id="taxRate" name="taxRate" value={formData.taxRate} onChange={handleChange} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="discount">Discount</label>
                            <input type="number" id="discount" name="discount" value={formData.discount} onChange={handleChange} />
                        </div>

                        <div className="form-field">
                            <label htmlFor="currency">Currency</label>
                            <select id="currency" name="currency" value={formData.currency} onChange={handleChange}>
                                <option value="">Select Currency</option>
                                <option value="LKR">LKR</option>
                                <option value="USD">USD</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={formData.status} onChange={handleChange}>
                                <option value="">Select Status</option>
                                <option value="APPROVED">APPROVED</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                                <option value="Overdue">OVERDUE</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="supplierId">Supplier</label>
                            <select id="supplierId" name="supplierId" value={formData.supplierId || ""} onChange={handleChange}>
                                <option value="">Select Supplier</option>
                                {suppliers.map((s) => <option key={s.supplierId} value={s.supplierId}>{s.name}</option>)}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="purchaseOrderId">Purchase Order</label>
                            <select
                                id="purchaseOrderId"
                                name="purchaseOrderId"
                                value={formData.purchaseOrderId || ""}
                                onChange={handleChange}
                            >
                                <option value="">Select Purchase Order</option>
                                {purchaseOrders.map((po) => <option key={po.id} value={po.id}>{po.poNumber}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="btn-group">
                        {!isEditing && <button className="btn primary" onClick={handleSave}>Save</button>}
                        {isEditing && <button className="btn success" onClick={handleUpdate}>Update</button>}
                        <button className="btn warning" onClick={clearForm}>Clear</button>
                    </div>
                </section>

                <section className="card table-section">
                    <h3>Invoice Records</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Invoice No</th>
                            <th>Date</th>
                            <th>Due Date</th>
                            <th>Amount</th>
                            <th>Tax Rate</th>
                            <th>Discount</th>
                            <th>Status</th>
                            <th>Currency</th>
                            <th>Supplier</th>
                            <th>PO ID</th>
                            <th>Manage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[...invoices].sort((a, b) => (a.id ?? 0) - (b.id ?? 0)).map((inv) => (
                            <tr key={inv.id}>
                                <td>{inv.id}</td>
                                <td>{inv.invoiceNumber}</td>
                                <td>{formatDate(inv.date)}</td>
                                <td>{formatDate(inv.dueDate)}</td>
                                <td>{inv.amount}</td>
                                <td>{inv.taxRate}</td>
                                <td>{inv.discount}</td>
                                <td>{inv.status}</td>
                                <td>{inv.currency}</td>
                                <td>{suppliers.find((s) => s.supplierId === inv.supplierId)?.name || ""}</td>
                                <td>{inv.purchaseOrderId}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(inv)}>Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(inv.id!)}>Delete</button>
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

export default InvoicePage;