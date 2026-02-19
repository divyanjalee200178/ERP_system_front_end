// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <h2 className="logo">ERP Finance</h2>
            <ul>
                <li>
                    <NavLink to="/accounts" className={({ isActive }) => (isActive ? "active" : "")}>
                        Chart of Accounts
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/journal-entry" className={({ isActive }) => (isActive ? "active" : "")}>
                        Journal Entry
                    </NavLink>
                </li>

                {/* Placeholder links */}
                <li>
                    <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/general-ledger" className={({ isActive }) => (isActive ? "active" : "")}>
                        General Ledger
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/accounts-payable" className={({ isActive }) => (isActive ? "active" : "")}>
                        Accounts Payable
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/accounts-receivable" className={({ isActive }) => (isActive ? "active" : "")}>
                        Accounts Receivable
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/fixed-assets" className={({ isActive }) => (isActive ? "active" : "")}>
                        Fixed Assets
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/bank-reconciliation" className={({ isActive }) => (isActive ? "active" : "")}>
                        Bank & Reconciliation
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/budgeting" className={({ isActive }) => (isActive ? "active" : "")}>
                        Budgeting
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/financial-reports" className={({ isActive }) => (isActive ? "active" : "")}>
                        Financial Reports
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/user-management" className={({ isActive }) => (isActive ? "active" : "")}>
                        User Management
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/module-setup" className={({ isActive }) => (isActive ? "active" : "")}>
                        Module Setup
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;