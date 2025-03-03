import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/useAuth";
import { useWeb3 } from "../loginsystem/useWeb3";
import Loading from "../components/Loading";
import "./styles/Onboarding.css"; // ✅ Importuojam naują prabangų dizainą

export default function Index() {
    const { login, isAuthenticated } = useAuth();
    const { connect, isConnected } = useWeb3();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        if (isAuthenticated || isConnected) {
            router.push("/dashboard");
        }
    }, [isAuthenticated, isConnected, router]);

    const handleEmailLogin = async () => {
        setLoading(true);
        await login(rememberMe);
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
                <img src="/logo.svg" alt="NordBaltic Logo" className="logo fade-in-scale" />
            </div>
            <div className="onboarding-card glass-morph slide-up">
                <h2 className="welcome-text">🚀 Welcome to <span>NordBalticum</span></h2>
                <p className="subtext">The Future of Secure & Decentralized Banking</p>

                <button className="primary-btn hover-scale" onClick={handleEmailLogin}>
                    ✉️ Login with Email
                </button>
                <button className="wallet-btn hover-scale" onClick={handleWalletLogin}>
                    🔗 Login with Wallet
                </button>

                <div className="remember-me">
                    <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    <label htmlFor="remember">Remember Me</label>
                </div>

                <p className="signup-text">New here? <a href="/register">Create an Account</a></p>
            </div>
            <div className="background-animation"></div>
        </div>
    );
}
