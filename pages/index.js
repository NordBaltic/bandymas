import React from "react";
import { useRouter } from "next/router";
import "./Index.css";
import { useAuth } from "../context/useAuth";

export default function Index() {
    const router = useRouter();
    const { loginWithEmail, loginWithWallet } = useAuth();

    return (
        <div className="onboarding-container fade-in">
            {/* 🔥 Logotipas */}
            <div className="logo-container">
                <img src="/logo.png" alt="Logo" className="logo" />
            </div>

            {/* 🔥 Prisijungimo kortelė */}
            <div className="login-box glass-morph">
                <h2 className="welcome-text">Welcome to NordBalticum</h2>
                <p className="subtitle">Secure & Decentralized Finance</p>

                {/* 🔹 Prisijungimo mygtukai */}
                <button className="login-button" onClick={() => loginWithEmail()}>
                    📧 Login with Email
                </button>
                <button className="wallet-button" onClick={() => loginWithWallet()}>
                    🔗 Login with Wallet
                </button>

                <p className="disclaimer">
                    By continuing, you agree to our <a href="/terms">Terms & Conditions</a>.
                </p>
            </div>
        </div>
    );
}
