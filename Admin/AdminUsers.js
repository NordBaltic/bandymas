import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import "./AdminUsers.css";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

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

    // ✅ Blokuoti / Atblokuoti vartotoją
    const toggleBan = async (id, isBanned) => {
        const { error } = await supabase
            .from("users")
            .update({ banned: !isBanned })
            .eq("id", id);

        if (error) {
            toast.error("Nepavyko pakeisti vartotojo būsenos.");
        } else {
            toast.success(isBanned ? "Vartotojas atblokuotas." : "Vartotojas užblokuotas.");
            fetchUsers();
        }
    };

    // ✅ Užšaldyti / Atšildyti piniginę
    const toggleWalletFreeze = async (id, isFrozen) => {
        const { error } = await supabase
            .from("users")
            .update({ wallet_frozen: !isFrozen })
            .eq("id", id);

        if (error) {
            toast.error("Nepavyko pakeisti piniginės būsenos.");
        } else {
            toast.success(isFrozen ? "Piniginė atšildyta." : "Piniginė užšaldyta.");
            fetchUsers();
        }
    };

    // ✅ Keisti vartotojo rolę (User / Admin)
    const changeRole = async (id, newRole) => {
        const { error } = await supabase
            .from("users")
            .update({ role: newRole })
            .eq("id", id);

        if (error) {
            toast.error("Nepavyko pakeisti vartotojo rolės.");
        } else {
            toast.success(`Vartotojo rolė pakeista į ${newRole}.`);
            fetchUsers();
        }
    };

    // ✅ Filtruoti vartotojus
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.wallet.toLowerCase().includes(search.toLowerCase())
    );

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

            {loading ? (
                <p className="loading-text">⏳ Kraunama...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>El. paštas</th>
                            <th>Piniginė</th>
                            <th>Rolė</th>
                            <th>Būsena</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>{user.wallet}</td>
                                <td>
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeRole(user.id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td>
                                    {user.banned ? "❌ Užblokuotas" : "✅ Aktyvus"}
                                </td>
                                <td>
                                    <button onClick={() => toggleBan(user.id, user.banned)}
                                        className={user.banned ? "unban-btn" : "ban-btn"}>
                                        {user.banned ? "Atblokuoti" : "Blokuoti"}
                                    </button>

                                    <button onClick={() => toggleWalletFreeze(user.id, user.wallet_frozen)}
                                        className={user.wallet_frozen ? "unfreeze-btn" : "freeze-btn"}>
                                        {user.wallet_frozen ? "Atšildyti" : "Užšaldyti"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
