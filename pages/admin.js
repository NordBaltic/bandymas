import React from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminSettings from "../components/admin/AdminSettings";

export default function AdminPanel() {
    return (
        <div className="admin-page">
            <AdminDashboard />
            <AdminUsers />
            <AdminSettings />
        </div>
    );
}
