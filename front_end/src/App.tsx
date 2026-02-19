// App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import JournalEntryPage from "./pages/JournalEntryPage";
import TrialBalance from "./pages/TrialBalance";
import LoginPage from "./pages/LoginPage";
import LedgerDetails from "./pages/LedgerDetails";

const App: React.FC = () => {
    return (
        <Routes>
            {/* Redirect / to /accounts */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/accounts" />} />

            {/* Define your routes */}
            <Route path="/accounts" element={<AccountPage />} />
            <Route path="/journal-entry" element={<JournalEntryPage />} />
            <Route path="/trial-balance" element={<TrialBalance />} />
            <Route path="/ledger-details" element={<LedgerDetails />} />

            {/* Fallback for 404 */}
            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
};

export default App;