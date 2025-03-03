import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/useAuth";
import { useWeb3 } from "../hooks/useWeb3";
import Loading from "../components/Loading";

export default function Index() {
    const { login, isAuthenticated } = useAuth();
    const { connect, isConnected } = useWeb3();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated || isConnected) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isConnected, router]);

    const handleEmailLogin = async () => {
        setLoading(true);
        await login();
        setLoading(false);
    };

    const handleWalletLogin = async () => {
        setLoading(true);
        await connect();
        setLoading(false);
    };

    return (
        <div className="onboarding-container">
            {loading && <Loading fullscreen />}
            <div className="logo-container">
                <img src="/logo.svg" alt="NordBaltic Logo" className="logo" />
            </div>
            <div className="onboarding-card glass-morph fade-in">
                <h2 className="welcome-text">Welcome to NordBalticum</h2>
                <p className="subtext">Secure, Fast, and Decentralized Banking</p>
                <button className="primary-btn" onClick={handleEmailLogin}>Login with Email</button>
                <button className="wallet-btn" onClick={handleWalletLogin}>Login with Wallet</button>
                <p className="signup-text">Don't have an account? <a href="/register">Sign Up</a></p>
            </div>
            <div className="background-animation"></div>
        </div>
    );
}
