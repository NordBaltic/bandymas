import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
import AdminUsers from "../admin/AdminUsers";
import AdminSettings from "../admin/AdminSettings";
import SwapMonitor from "../admin/SwapMonitor";
import StakeMonitor from "../admin/StakeMonitor";
import DonationsMonitor from "../admin/DonationsMonitor";

export default function AdminDashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="admin-container">
            <h2 className="admin-title">⚡ Admin Dashboard</h2>
            <button onClick={logout} className="admin-logout-btn">Logout</button>
        </div>
    );
}
