import { useEffect } from "react";
import { useAuth } from "../loginsystem/AuthProvider"; // ✅ Teisingas importas
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            if (router.pathname !== "/login") { // ⛔ Apsauga nuo loopo
                toast.error("You must be logged in to access this page.");
                router.push("/login");
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Loading, please wait...</p>
            </div>
        );
    }

    return <>{children}</>;
}
