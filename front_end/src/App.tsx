// App.tsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import JournalEntryPage from "./pages/JournalEntryPage";
import TrialBalance from "./pages/TrialBalance";
import LoginPage from "./pages/LoginPage";
import LedgerDetails from "./pages/LedgerDetails";
import InvoicePage from "./pages/InvoicePage.tsx";
import SupplierPage from "./pages/SupplierPage";
import AccountsPayable from "./pages/AccountsPayable.tsx";
import AccountsReceivable from "./pages/AccountsReceivable.tsx";
import FixedAssetPage from "./pages/FixedAssetPage.tsx";
import DepreciationSchedulePage from "./pages/DepreciationSchedulePage.tsx";
import AssetDisposalsPage from "./pages/AssetDisposalsPage.tsx";
import BudgetPage from "./pages/BudgetPage.tsx";
import BudgetVsActualPage from "./pages/BudgetVsActualPage.tsx";
import VarianceDetailsPage from "./pages/VarianceDetails.tsx";
import UserPage from "./pages/UserPage.tsx";
import BankReconciliationPage from "./pages/BankReconciliationPage.tsx";
import TransactionPage from "./pages/TransactionPage.tsx";
import FinancialReportsPage from "./pages/FinancialReportsPage.tsx";
import IncomeSheetPage from "./pages/IncomeSheetPage.tsx";
import CashFlowPage from "./pages/CashFlowPage.tsx";
import FinancialRatiosPage from "./pages/FinancialRatios.tsx";

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
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/supplier" element={<SupplierPage />} />
            <Route path="/account-payable" element={<AccountsPayable />} />
            <Route path="/account-recievable" element={<AccountsReceivable />} />
            <Route path="/fixed-assets" element={<FixedAssetPage />} />
            <Route path="/depreciation-schedule" element={<DepreciationSchedulePage />} />
            <Route path="/asset-disposals" element={<AssetDisposalsPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/Variance-details" element={<VarianceDetailsPage />} />
            <Route path="/budgetVsActualPage" element={<BudgetVsActualPage />} />
            <Route path="/user" element={<UserPage />} />
            {/*<Route path="/user-roles" element={<RolesPage />} />*/}
            <Route path="/bank-reconciliation" element={<BankReconciliationPage />} />
            <Route path="/transaction" element={<TransactionPage />} />
            <Route path="/financial" element={<FinancialReportsPage />} />
            <Route path="/income" element={<IncomeSheetPage />} />
            <Route path="/cash" element={<CashFlowPage />} />
            <Route path="/FinancialRatio" element={<FinancialRatiosPage />} />

            {/* Fallback for 404 */}
            <Route path="*" element={<h2>Page Not Found</h2>} />
        </Routes>
    );
};

export default App;