import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./Admin.css";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [sortField, setSortField] = useState("created_at");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(() => {
            fetchTransactions();
        }, 30000); // ✅ Atnaujinama kas 30 sek.
        return () => clearInterval(interval);
    }, [filterType, sortField, sortOrder]);

    // ✅ Gauti visus vartotojų pavedimus
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase.from("transactions").select("*").order(sortField, { ascending: sortOrder === "asc" });

            if (filterType !== "all") {
                query = query.eq("type", filterType);
            }

            let { data, error } = await query;
            if (error) throw error;

            setTransactions(data);
        } catch (error) {
            toast.error("❌ Nepavyko gauti transakcijų.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filterType, sortField, sortOrder]);

    // ✅ Keičia rūšiavimo tvarką
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    return (
        <div className="admin-transactions-container fade-in">
            <h1 className="admin-title">📜 Transakcijų valdymas</h1>

            {/* 🔥 Filtravimo mygtukai */}
            <div className="filter-buttons">
                {["all", "donation", "swap", "staking", "payment", "admin_fee"].map((type) => (
                    <button
                        key={type}
                        className={`filter-btn ${filterType === type ? "active" : ""}`}
                        onClick={() => setFilterType(type)}
                    >
                        {type === "all" ? "Visos" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
                <button className="refresh-btn" onClick={fetchTransactions}>🔄 Atnaujinti</button>
            </div>

            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : transactions.length === 0 ? (
                <p className="empty-state">🚫 Nėra transakcijų.</p>
            ) : (
                <div className="transactions-wrapper">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("user")}>Vartotojas ⬍</th>
                                <th onClick={() => handleSort("type")}>Tipas ⬍</th>
                                <th onClick={() => handleSort("amount")}>Suma ⬍</th>
                                <th onClick={() => handleSort("recipient")}>Gavėjas ⬍</th>
                                <th onClick={() => handleSort("created_at")}>Data ⬍</th>
                                <th>Statusas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="transaction-row fade-in">
                                    <td>{tx.user}</td>
                                    <td className={`tx-type ${tx.type}`}>{tx.type}</td>
                                    <td>{tx.amount} BNB</td>
                                    <td>{tx.recipient}</td>
                                    <td>{new Date(tx.created_at).toLocaleString()}</td>
                                    <td className={`status ${tx.status === "completed" ? "success" : "pending"}`}>
                                        {tx.status === "completed" ? "✅ Įvykdyta" : "⏳ Laukiama"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
