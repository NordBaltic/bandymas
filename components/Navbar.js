import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../loginsystem/AuthProvider"; // ✅ Teisingas importas!
import "../styles/Navbar.css";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, wallet, logout, loginWithWallet } = useAuth(); // ✅ Pataisytas importas
    const router = useRouter();
    const adminWallet = process.env.NEXT_PUBLIC_ADMIN_WALLET; // ✅ Admino wallet iš .env

    return (
        <nav className="navbar">
            {/* ✅ Logotipas */}
            <div className="navbar-logo">
                <Link href="/">
                    <img src="/logo.svg" alt="NordBalticum" className="logo" />
                </Link>
            </div>

            {/* ✅ Meniu */}
            <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
                <li>
                    <Link href="/dashboard" className={router.pathname === "/dashboard" ? "active" : ""}>
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/stake" className={router.pathname === "/stake" ? "active" : ""}>
                        Staking
                    </Link>
                </li>
                <li>
                    <Link href="/swap" className={router.pathname === "/swap" ? "active" : ""}>
                        Swap
                    </Link>
                </li>
                <li>
                    <Link href="/donate" className={router.pathname === "/donate" ? "active" : ""}>
                        Donations
                    </Link>
                </li>
                {/* ✅ Admin panelė (rodoma tik adminui) */}
                {wallet && adminWallet && wallet.toLowerCase() === adminWallet.toLowerCase() && (
                    <li>
                        <Link href="/admin" className={router.pathname === "/admin" ? "active" : ""}>
                            Admin
                        </Link>
                    </li>
                )}
            </ul>

            {/* ✅ Prisijungimo ir Logout mygtukai */}
            <div className="auth-buttons">
                {!user && !wallet ? (
                    <>
                        <Link href="/login" className="login-btn">Email Login</Link>
                        <button className="wallet-login-btn" onClick={loginWithWallet}>
                            Wallet Login
                        </button>
                    </>
                ) : (
                    <button className="logout-btn" onClick={logout}>Logout</button>
                )}
            </div>

            {/* ✅ Mobiliam meniu */}
            <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                <img src="/menu-icon.svg" alt="Menu" />
            </button>
        </nav>
    );
}
