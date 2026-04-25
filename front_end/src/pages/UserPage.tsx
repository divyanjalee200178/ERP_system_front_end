import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { userService } from "../services/userService";
import type { UserDTO } from "../types/UserTypes";
import { Link } from "react-router-dom";
import "../styles/user.css";

const emptyUser: UserDTO = {
    u_id: 0,
    name: "",
    contact: "",
    address: "",
    email: "",
    role: "",
    password: "",
    department: "",
    lastLogin: "",
    status: ""
};

const UserPage: React.FC = () => {
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDTO>(emptyUser);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userService.getUsers();
            const cleaned = data.map(u => ({
                ...emptyUser,
                ...u
            }));
            setUsers(cleaned);
        } catch (err) {
            console.error("Error loading users:", err);
            alert("Failed to load users. Check backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSelectedUser(prev => ({
            ...prev,
            [name]: value ?? ""
        }));
    };

    const handleSave = async () => {
        try {
            if (selectedUser.u_id !== 0) await userService.updateUser(selectedUser);
            else await userService.saveUser(selectedUser);
            await loadUsers();
            handleClear();
        } catch (err) {
            console.error("Save failed:", err);
            alert("Operation failed");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this user?")) return;
        await userService.deleteUser(id);
        loadUsers();
    };

    const handleEdit = (user: UserDTO) => {
        setSelectedUser({
            ...emptyUser,
            ...user,
            password: "" // don't prefill password
        });
    };

    const handleClear = () => setSelectedUser(emptyUser);

    if (loading) return <div className="main-content">Loading...</div>;

    // ✅ Summary card data
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === "Active").length;
    const inactiveUsers = users.filter(u => u.status === "Inactive").length;
    const userRoles = new Set(users.map(u => u.role)).size;

    return (
        <div className="dashboard">
            <Sidebar />
            <main className="main-content">
                <header className="page-header">
                    <h1>User Management</h1>
                    <nav className="page-nav">
                        <Link to="/users" className="nav-link">Users</Link>
                        {/*<Link to="/user-roles" className="nav-link">Roles & Permissions</Link>*/}
                    </nav>
                </header>

                {/* ===== Summary Cards ===== */}
                <section className="card stats-cards">
                    <div className="card-item">
                        <h4>Total Users</h4>
                        <p>{totalUsers}</p>
                    </div>
                    <div className="card-item">
                        <h4>Active Users</h4>
                        <p>{activeUsers}</p>
                    </div>
                    <div className="card-item">
                        <h4>Inactive Users</h4>
                        <p>{inactiveUsers}</p>
                    </div>
                    <div className="card-item">
                        <h4>User Roles</h4>
                        <p>{userRoles}</p>
                    </div>
                </section>

                {/* ===== User Form ===== */}
                <section className="card form-card">
                    <h3>Add / Update User</h3>
                    <div className="form-grid">

                        <div className="form-field">
                            <label>Name</label>
                            <input name="name" value={selectedUser.name} onChange={handleChange}/>
                        </div>

                        <div className="form-field">
                            <label>Contact</label>
                            <input name="contact" value={selectedUser.contact} onChange={handleChange}/>
                        </div>

                        <div className="form-field">
                            <label>Address</label>
                            <input name="address" value={selectedUser.address} onChange={handleChange}/>
                        </div>

                        <div className="form-field">
                            <label>Email</label>
                            <input name="email" value={selectedUser.email} onChange={handleChange}/>
                        </div>

                        <div className="form-field">
                            <label>Role</label>
                            <select name="role" value={selectedUser.role} onChange={handleChange}>
                                <option value="">Select Role</option>
                                <option value="ADMIN">ADMIN</option>
                                <option value="MANAGER">Manager</option>

                            </select>
                        </div>

                        <div className="form-field">
                            <label>Department</label>
                            <input
                                name="department"
                                value={selectedUser.department}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                        <label>Last Login</label>
                            <input type="datetime-local" name="lastLogin" value={selectedUser.lastLogin} onChange={handleChange}/>
                        </div>

                        <div className="form-field">
                            <label>Status</label>
                            <select name="status" value={selectedUser.status} onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label>Password</label>
                            <input type="password" name="password" value={selectedUser.password} onChange={handleChange}/>
                        </div>

                    </div>

                    <div className="btn-group">
                        <button className="btn primary" onClick={handleSave}>
                            {selectedUser.u_id !== 0 ? "Update" : "Save"}
                        </button>
                        <button className="btn warning" onClick={handleClear}>Clear</button>
                    </div>
                </section>

                {/* ===== Users Table ===== */}
                <section className="card table-section">
                    <h3>Users</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Department</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map(u => (
                            <tr key={u.u_id}>
                                <td>{u.u_id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.contact}</td>
                                <td>{u.address}</td>
                                <td>{u.department}</td>
                                <td>{u.lastLogin}</td>
                                <td>{u.status}</td>
                                <td>{u.role}</td>
                                <td>
                                    <button onClick={() => handleEdit(u)}>Edit</button>
                                    <button onClick={() => handleDelete(u.u_id)}>Delete</button>
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

export default UserPage;