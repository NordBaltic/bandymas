import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./Admin.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState("balance");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(() => {
            fetchUsers();
        }, 30000); // ✅ Auto update kas 30 sek.
        return () => clearInterval(interval);
    }, []);

    // ✅ Gauti vartotojus iš DB
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            let query = supabase
                .from("users")
                .select("*")
                .order(sortField, { ascending: sortOrder === "asc" });

            if (search) {
                query = query.or(`email.ilike.%${search}%,wallet.ilike.%${search}%`);
            }

            let { data, error } = await query;
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            toast.error("❌ Nepavyko gauti vartotojų.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [search, sortField, sortOrder]);

    // ✅ Keičia rūšiavimą
    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    // ✅ Pridėti/panaikinti balansą
    const adjustBalance = async (userId, wallet, type) => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("⚠️ Netinkama suma.");
            return;
        }

        const transactionAmount = type === "add" ? parseFloat(amount) : -parseFloat(amount);
        const finalAmount = transactionAmount * 0.97; // 3% admin fee

        try {
            let { error } = await supabase
                .from("users")
                .update({ balance: supabase.raw("balance + ?", [finalAmount]) })
                .eq("id", userId);

            if (error) throw error;

            await supabase.from("transactions").insert([
                {
                    user: userId,
                    recipient: wallet,
                    amount: finalAmount.toFixed(4),
                    type: type === "add" ? "Admin add funds" : "Admin deduct funds",
                },
            ]);

            toast.success(`✅ Balansas ${type === "add" ? "pridėtas" : "atimtas"} sėkmingai!`);
            fetchUsers();
        } catch (error) {
            toast.error("⚠️ Klaida keičiant balansą.");
            console.error(error);
        }
    };

    return (
        <div className="admin-users-container fade-in">
            <h1 className="admin-title">👤 Vartotojų valdymas</h1>

            {/* 🔍 Paieška */}
            <input 
                type="text" 
                placeholder="🔍 Ieškoti pagal el. paštą ar piniginę..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className="search-input"
            />

            {/* 📋 Vartotojų lentelė */}
            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort("email")}>Vartotojas ⬍</th>
                            <th>Piniginė</th>
                            <th onClick={() => handleSort("balance")}>Balansas ⬍</th>
                            <th onClick={() => handleSort("is_blocked")}>Statusas ⬍</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className={user.is_blocked ? "blocked-user" : "active-user"}>
                                <td>{user.email || "Web3 user"}</td>
                                <td>{user.wallet}</td>
                                <td>{user.balance.toFixed(4)} BNB</td>
                                <td>{user.is_blocked ? "❌ Blokuotas" : "✅ Aktyvus"}</td>
                                <td>
                                    <button onClick={() => adjustBalance(user.id, user.wallet, "add")}>➕ Pridėti</button>
                                    <button onClick={() => adjustBalance(user.id, user.wallet, "deduct")}>➖ Atimti</button>
                                    <button onClick={() => setSelectedUser(user)}>⚙️ Redaguoti</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
