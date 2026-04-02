// // src/components/Sidebar.tsx
// import React from "react";
// import { NavLink } from "react-router-dom";
// import "../styles/dashboard.css";
//
// const Sidebar: React.FC = () => {
//     return (
//         <div className="sidebar">
//             <h2 className="logo">ERP Finance</h2>
//             <ul>
//                 <li>
//                     <NavLink to="/accounts" className={({isActive}) => (isActive ? "active" : "")}>
//                         Chart of Accounts
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/journal-entry" className={({isActive}) => (isActive ? "active" : "")}>
//                         Journal Entry
//                     </NavLink>
//                 </li>
//
//                 {/* Placeholder links */}
//                 <li>
//                     <NavLink to="/dashboard" className={({isActive}) => (isActive ? "active" : "")}>
//                         Dashboard
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/general-ledger" className={({isActive}) => (isActive ? "active" : "")}>
//                         General Ledger
//                     </NavLink>
//                 </li>
//
//                 <li>
//                     <NavLink to="/invoice" className={({isActive}) => (isActive ? "active" : "")}>
//                         Invoice
//                     </NavLink>
//                 </li>
//
//                 <li>
//                     <NavLink to="/account-payable" className={({isActive}) => (isActive ? "active" : "")}>
//                         Accounts Payable
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/account-recievable" className={({isActive}) => (isActive ? "active" : "")}>
//                         Accounts Receivable
//                     </NavLink>
//                 </li>
//
//                 <li>
//                     <NavLink to="/supplier" className={({isActive}) => (isActive ? "active" : "")}>
//                         Supplier Manage
//                     </NavLink>
//                 </li>
//
//                 <li>
//                     <NavLink to="/fixed-assets" className={({isActive}) => (isActive ? "active" : "")}>
//                         Fixed Assets
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/bank-reconciliation" className={({isActive}) => (isActive ? "active" : "")}>
//                         Bank & Reconciliation
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/budget" className={({isActive}) => (isActive ? "active" : "")}>
//                         Budgeting
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/financial" className={({isActive}) => (isActive ? "active" : "")}>
//                         Financial Reports
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/user" className={({isActive}) => (isActive ? "active" : "")}>
//                         User Management
//                     </NavLink>
//                 </li>
//                 <li>
//                     <NavLink to="/module-setup" className={({isActive}) => (isActive ? "active" : "")}>
//                         Module Setup
//                     </NavLink>
//                 </li>
//             </ul>
//         </div>
//     );
// };
//
// export default Sidebar;

// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/sideBar.css";

const menuItems = [
    { path: "/dash", label: "Dashboard", icon: "🏠" },
    { path: "/accounts", label: "Chart of Accounts", icon: "📂" },
    { path: "/journal-entry", label: "Journal Entry", icon: "📝" },
    // { path: "/general-ledger", label: "General Ledger", icon: "📖" },
    { path: "/invoice", label: "Invoice", icon: "💵" },
    { path: "/account-payable", label: "Accounts Payable", icon: "💳" },
    { path: "/account-recievable", label: "Accounts Receivable", icon: "📬" },
    { path: "/supplier", label: "Supplier Manage", icon: "🏭" },
    { path: "/fixed-assets", label: "Fixed Assets", icon: "🏢" },
    { path: "/bank-reconciliation", label: "Bank & Reconciliation", icon: "🏦" },
    { path: "/budget", label: "Budgeting", icon: "📊" },
    { path: "/financial", label: "Financial Reports", icon: "📈" },
    { path: "/user", label: "User Management", icon: "👤" },
    { path: "/module-setup", label: "Module Setup", icon: "⚙️" },
];

const Sidebar: React.FC = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="logo">ERP Finance</h2>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li key={item.path}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="icon">{item.icon}</span>
                            <span className="label">{item.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;