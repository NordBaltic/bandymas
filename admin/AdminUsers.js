import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import "../../styles/admin.css"; // ✅ Teisingas kelias!

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            let { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            toast.error("⚠️ Klaida gaunant vartotojus.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-users-container fade-in">
            <h2 className="admin-title">👥 Vartotojų valdymas</h2>
            {loading ? (
                <p>⏳ Kraunama...</p>
            ) : (
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Email</th>
                            <th>Balansas</th>
                            <th>Statusas</th>
                            <th>Veiksmai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.email}</td>
                                <td>{user.balance} BNB</td>
                                <td>{user.is_blocked ? "❌ Blokuotas" : "✅ Aktyvus"}</td>
                                <td>
                                    <button onClick={() => alert("Blokuoti / atblokuoti vartotoją")}>
                                        {user.is_blocked ? "🔓 Atblokuoti" : "🔒 Blokuoti"}
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
