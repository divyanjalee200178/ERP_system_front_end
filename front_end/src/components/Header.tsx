// src/components/Header.tsx
import React from "react";
import "../styles/dashboard.css";

const Header: React.FC = () => {
    return (
        <div className="header">
            <h1>Chart of Accounts</h1>
            <div className="header-right">
                <button className="btn primary">+ Add Account</button>
                <button className="btn success">Export</button>
                <button className="btn info">Load Sample</button>
            </div>
        </div>
    );
};

export default Header;