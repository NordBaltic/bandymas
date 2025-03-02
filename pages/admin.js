import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/useAuth";
import AdminSidebar from "../Admin/AdminSidebar";
import AdminDashboard from "../Admin/AdminDashboard";
import AdminUsers from "../Admin/AdminUsers";
import AdminTransactions from "../Admin/AdminTransactions";
import AdminSettings from "../Admin/AdminSettings";
import Loading from "../components/Loading";
import "./admin.css";

export default function Admin() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Jei nėra prisijungęs adminas, nukreipiame atgal
    useEffect(() => {
        if (!loading && (!user || !user.isAdmin)) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return <Loading fullscreen={true} />;

    return (
        <div className="admin-page">
            {/* 🔥 Šoninė Navigacija */}
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* 🔥 Pagrindinis Admin Content */}
            <div className="admin-content">
                {activeTab === "dashboard" && <AdminDashboard />}
                {activeTab === "users" && <AdminUsers />}
                {activeTab === "transactions" && <AdminTransactions />}
                {activeTab === "settings" && <AdminSettings />}
            </div>
        </div>
    );
}
