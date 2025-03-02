import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    // ✅ Gauti vartotojus iš DB
    const fetchUsers = async () => {
        try {
            setLoading(true);
            let { data, error } = await supabase.from("users").select("*");
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            toast.error("Nepavyko gauti vartotojų sąrašo.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Pridėti/panaikinti balansą
    const adjustBalance = async (userId, wallet, type) => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error("Įveskite teisingą sumą.");
            return;
        }

        const transactionAmount = type === "add" ? parseFloat(amount) : -parseFloat(amount);
        const fee = transactionAmount * 0.03; // 3% fee adminui
        const finalAmount = transactionAmount - fee;

        try {
            // Atnaujinti balansą Supabase duomenų bazėje
            let { error } = await supabase
                .from("users")
                .update({ balance: supabase.raw("balance + ?", [finalAmount]) })
                .eq("id", userId);

            if (error) throw error;

            // Pridėti transakciją
            await supabase.from("transactions").insert([
                {
                    user: userId,
                    recipient: wallet,
                    amount: finalAmount.toFixed(4),
                    type: type === "add" ? "Admin add funds" : "Admin deduct funds",
                },
            ]);

            toast.success(`Balansas ${type === "add" ? "pridėtas" : "atimtas"} sėkmingai!`);
            fetchUsers(); // Atnaujinti UI
        } catch (error) {
            toast.error("Klaida keičiant balansą.");
            console.error(error);
        }
    };

    // ✅ Blokuoti/atblokuoti vartotoją
    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            let { error } = await supabase
                .from("users")
                .update({ is_blocked: !currentStatus })
                .eq("id", userId);

            if (error) throw error;

            toast.success(`Vartotojas ${!currentStatus ? "užblokuotas" : "atblokuotas"}!`);
            fetchUsers(); // Atnaujinti UI
        } catch (error) {
            toast.error("Nepavyko pakeisti vartotojo statuso.");
            console.error(error);
        }
    };

    return (
        <div className="admin-users-container fade-in">
            <h1 className="admin-title">👤 Vartotojų valdymas</h1>

            {loading ? (
                <p>Kraunama...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Vartotojas</th>
                            <th>Piniginė</th>
                            <th>Balansas</th>
                            <th>Statusas</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.email || "Web3 user"}</td>
                                <td>{user.wallet}</td>
                                <td>{user.balance.toFixed(4)} BNB</td>
                                <td>{user.is_blocked ? "❌ Blokuotas" : "✅ Aktyvus"}</td>
                                <td>
                                    <button onClick={() => toggleUserStatus(user.id, user.is_blocked)}>
                                        {user.is_blocked ? "Atblokuoti" : "Blokuoti"}
                                    </button>
                                    <button onClick={() => setSelectedUser(user)}>💰 Keisti balansą</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modalas balansui redaguoti */}
            {selectedUser && (
                <div className="modal-overlay">
                    <div className="modal glass-morph">
                        <h2>Keisti balansą ({selectedUser.email || "Web3 user"})</h2>
                        <input
                            type="number"
                            placeholder="Suma BNB"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <button onClick={() => adjustBalance(selectedUser.id, selectedUser.wallet, "add")}>
                            ➕ Pridėti
                        </button>
                        <button onClick={() => adjustBalance(selectedUser.id, selectedUser.wallet, "deduct")}>
                            ➖ Atimti
                        </button>
                        <button onClick={() => setSelectedUser(null)}>❌ Uždaryti</button>
                    </div>
                </div>
            )}
        </div>
    );
}
