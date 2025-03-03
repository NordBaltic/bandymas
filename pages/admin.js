import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import AdminUsers from "../admin/AdminUsers";
import AdminSettings from "../admin/AdminSettings";
import SwapMonitor from "../admin/SwapMonitor";
import StakeMonitor from "../admin/StakeMonitor";
import DonationsMonitor from "../admin/DonationsMonitor";
import styles from "../styles/admin.css";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        const { data, error } = await supabase.from("users").select("*");
        if (error) {
            toast.error("⚠️ Failed to load users.");
        } else {
            setUsers(data);
        }
        setLoading(false);
    };

    return (
        <div className="admin-container">
            <h2 className="admin-title">⚡ Admin Dashboard</h2>
            <button onClick={logout} className="admin-logout-btn">Logout</button>

            <div className="admin-sections">
                <AdminUsers users={users} loading={loading} />
                <StakeMonitor />
                <SwapMonitor />
                <DonationsMonitor />
                <AdminSettings />
            </div>
        </div>
    );
}
