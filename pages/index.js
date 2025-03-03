import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/AuthProvider";
import Loading from "../components/Loading";
import "./styles/Onboarding.css"; 

export default function Index() {
    const { loginWithEmail, loginWithWallet, user, wallet } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET; // ✅ Imama iš .env

    useEffect(() => {
        if (user || wallet) {
            // ✅ Automatinis admino nukreipimas
            if (wallet && wallet.toLowerCase() === adminWallet.toLowerCase()) {
                router.push("/admin");
            } else {
                router.push("/dashboard");
            }
        }
    }, [user, wallet, router, adminWallet]);

    return (
        <div className="onboarding-container">
            {loading && <Loading fullscreen />}
            
            {/* ✅ Logotipas */}
            <div className="logo-container">
                <img src="/logo.svg" alt="NordBaltic Logo" className="logo fade-in-scale" />
            </div>

            {/* ✅ Prisijungimo kortelė */}
            <div className="onboarding-card glass-morph slide-up">
                <h2 className="welcome-text">🚀 Welcome to <span>NordBalticum</span></h2>
                <p className="subtext">The Future of Secure & Decentralized Banking</p>

                {/* ✅ Prisijungimo mygtukai */}
                <button className="primary-btn hover-scale" onClick={async () => { setLoading(true); await loginWithEmail(); setLoading(false); }}>
                    ✉️ Login with Email
                </button>
                <button className="wallet-btn hover-scale" onClick={async () => { setLoading(true); await loginWithWallet(); setLoading(false); }}>
                    🔗 Login with Wallet
                </button>

                {/* ✅ Remember Me */}
                <div className="remember-me">
                    <input type="checkbox" id="remember" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                    <label htmlFor="remember">Remember Me</label>
                </div>

                {/* ✅ Registracija */}
                <p className="signup-text">New here? <a href="/register">Create an Account</a></p>
            </div>

            {/* ✅ Fono animacija */}
            <div className="background-animation"></div>
        </div>
    );
}
