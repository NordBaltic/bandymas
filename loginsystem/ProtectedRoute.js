import { useAuth } from "./useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading]);

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return <>{children}</>;
}
