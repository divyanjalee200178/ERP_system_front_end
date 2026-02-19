// src/components/AccountHierarchy.tsx
import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/accountService";
import "../styles/dashboard.css";

interface Account {
    accountId: number;
    accountCode: string;
    name: string;
    type: string;
    subType: string;
    balance: number;
    status: string;
}

const AccountHierarchy: React.FC = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);


    useEffect(() => {
        let isMounted = true; // track if component is mounted

        const loadAccounts = async () => {
            try {
                const dataFromApi = await getAccounts();
                const mappedAccounts: Account[] = dataFromApi.map(acc => ({
                    accountId: acc.accountId ?? 0,
                    accountCode: acc.accountCode ?? "",
                    name: acc.name,
                    type: acc.type,
                    subType: "",
                    balance: 0,
                    status: "Active"
                }));

                if (isMounted) setAccounts(mappedAccounts); // only set state if still mounted
            } catch (err) {
                console.error("Failed to load accounts:", err);
            }
        };

        loadAccounts();

        return () => {
            isMounted = false; // cleanup
        };
    }, []);

    const groupByType = (type: string) =>
        accounts.filter((acc) => acc.type === type);

    return (
        <div className="card">
            <h2>Account Hierarchy</h2>

            {["Asset", "Liability", "Equity", "Revenue", "Expense"].map((type) => (
                <div key={type} className="account-group">
                    <h3>{type} Accounts</h3>
                    {groupByType(type).map((acc) => (
                        <div key={acc.accountId} className="account-row">
                            <div>
                                <strong>{acc.accountCode}</strong> - {acc.name}
                            </div>
                            <div>${acc.balance?.toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default AccountHierarchy;