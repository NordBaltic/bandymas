import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import AdminUsers from "../admin/AdminUsers";
import AdminSettings from "../admin/AdminSettings";
import SwapMonitor from "../admin/SwapMonitor";
import StakeMonitor from "../admin/StakeMonitor";
import DonationsMonitor from "../admin/DonationsMonitor";
import "../styles/Admin.css"; // ✅ Naujas stiliaus failas

const ADMIN_WALLET = process.env.NEXT_PUBLIC_ADMIN_WALLET;

export default function AdminDashboard() {
    const { wallet, logout } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // ✅ Tikrina, ar vartotojas yra adminas
    useEffect(() => {
        if (!wallet) return;
        if (wallet.toLowerCase() !== ADMIN_WALLET.toLowerCase()) {
            toast.error("❌ Unauthorized access.");
            router.push("/");
        } else {
            fetchUsers();
        }
    }, [wallet, router]);

    // ✅ Gauna visus vartotojus iš duomenų bazės
    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from("users").select("*");
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            toast.error("❌ Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container fade-in">
            <h1 className="admin-title">⚡ Admin Dashboard</h1>
            
            {/* ✅ Atsijungimo mygtukas */}
            <button onClick={logout} className="admin-logout-btn">🚪 Logout</button>

            {/* ✅ Admin skiltys */}
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
