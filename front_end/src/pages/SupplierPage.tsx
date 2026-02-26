import React, { useEffect, useState } from "react";
import "../styles/Invoice.css"; // same CSS file use karanawa
import { supplierService } from "../services/SupplierService";
import type { SupplierDTO } from "../types/supplierTypes";
import Sidebar from "../components/Sidebar";

const SupplierPage: React.FC = () => {

    const [suppliers, setSuppliers] = useState<SupplierDTO[]>([]);
    const [formData, setFormData] = useState<SupplierDTO>({
        supplierId: 0,
        name: "",
        contactNumber: "",
        email: "",
        address: "",
        status: ""
    });

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const data = await supplierService.getAll();
            setSuppliers(data);
        };
        fetchData();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        await supplierService.save(formData);
        clearForm();
        const updated = await supplierService.getAll();
        setSuppliers(updated);
    };

    const handleUpdate = async () => {
        await supplierService.update(formData);
        clearForm();
        const updated = await supplierService.getAll();
        setSuppliers(updated);
        setIsEditing(false);
    };

    const handleEdit = (sup: SupplierDTO) => {
        setFormData(sup);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        await supplierService.delete(id);
        const updated = await supplierService.getAll();
        setSuppliers(updated);
    };

    const clearForm = () => {
        setFormData({
            supplierId: 0,
            name: "",
            contactNumber: "",
            email: "",
            address: "",
            status: ""
        });
        setIsEditing(false);
    };

    return (
        <div className="dashboard">
            <Sidebar />

            <main className="main-content">
                <header className="top-bar">
                    <h1>Supplier Management</h1>
                </header>

                {/* FORM CARD */}
                <section className="card form-card">
                    <h3>Add / Update Supplier</h3>

                    <div className="form-grid">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Supplier Name"
                        />

                        <input
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleChange}
                            placeholder="Contact Number"
                        />

                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                        />

                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Address"
                        />

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="">Select Status</option>
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="INACTIVE">INACTIVE</option>
                        </select>
                    </div>

                    <div className="btn-group">
                        {!isEditing && (
                            <button className="btn primary" onClick={handleSave}>
                                Save
                            </button>
                        )}
                        {isEditing && (
                            <button className="btn success" onClick={handleUpdate}>
                                Update
                            </button>
                        )}
                        <button className="btn warning" onClick={clearForm}>
                            Clear
                        </button>
                    </div>
                </section>

                {/* TABLE CARD */}
                <section className="card table-section">
                    <h3>Supplier Records</h3>

                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Manage</th>
                        </tr>
                        </thead>

                        <tbody>
                        {suppliers.map((sup) => (
                            <tr key={sup.supplierId}>
                                <td>{sup.supplierId}</td>
                                <td>{sup.name}</td>
                                <td>{sup.contactNumber}</td>
                                <td>{sup.email}</td>
                                <td>{sup.address}</td>
                                <td>{sup.status}</td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleEdit(sup)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(sup.supplierId)}
                                    >
                                        Delete
                                    </button>
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

export default SupplierPage;