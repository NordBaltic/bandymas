import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [amount, setAmount] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [actionType, setActionType] = useState("deposit"); // "deposit" arba "withdraw"

    useEffect(() => {
        fetchUsers();
    }, []);

    // ✅ Gauti visus vartotojus iš Supabase
    const fetchUsers = async () => {
        setLoading(true);
        let { data, error } = await supabase.from("users").select("*");

        if (error) {
            toast.error("Nepavyko gauti vartotojų duomenų.");
            console.error(error);
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    // ✅ Balanso papildymas arba nuskaitymas
    const handleBalanceChange = async () => {
        if (!selectedUser || !amount) {
            toast.error("Pasirinkite vartotoją ir įveskite sumą.");
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            toast.error("Netinkama suma.");
            return;
        }

        const newBalance =
            actionType === "deposit"
                ? selectedUser.balance + numericAmount
                : selectedUser.balance - numericAmount;

        if (newBalance < 0) {
            toast.error("Nepakankamas vartotojo balansas.");
            return;
        }

        const { error } = await supabase
            .from("users")
            .update({ balance: newBalance })
            .eq("id", selectedUser.id);

        if (error) {
            toast.error("Nepavyko atnaujinti balanso.");
            console.error(error);
        } else {
            toast.success(
                actionType === "deposit"
                    ? `Balansas papildytas ${numericAmount} USD.`
                    : `Iš vartotojo nuskaityta ${numericAmount} USD.`
            );
            fetchUsers();
            setAmount("");
        }
    };

    // ✅ Pasirinkti vartotoją balanso operacijoms
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setAmount("");
    };

    return (
        <div className="admin-users-container fade-in">
            <h1 className="admin-title">👑 Vartotojų valdymas</h1>

            <input
                type="text"
                placeholder="🔎 Ieškoti pagal el. paštą ar piniginę..."
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="balance-action-container">
                <select onChange={(e) => setActionType(e.target.value)}>
                    <option value="deposit">💰 Papildyti balansą</option>
                    <option value="withdraw">📉 Nuskaityti lėšas</option>
                </select>
                <input
                    type="number"
                    placeholder="Suma (USD)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={handleBalanceChange} disabled={!selectedUser}>
                    {actionType === "deposit" ? "Papildyti balansą" : "Nuskaityti lėšas"}
                </button>
            </div>

            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>El. paštas</th>
                            <th>Piniginė</th>
                            <th>Balansas</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users
                            .filter(
                                (user) =>
                                    user.email.toLowerCase().includes(search.toLowerCase()) ||
                                    user.wallet.toLowerCase().includes(search.toLowerCase())
                            )
                            .map((user) => (
                                <tr key={user.id} onClick={() => handleUserSelect(user)}>
                                    <td>{user.id}</td>
                                    <td>{user.email}</td>
                                    <td>{user.wallet}</td>
                                    <td>{user.balance} USD</td>
                                    <td>
                                        <button className="select-btn">Pasirinkti</button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
