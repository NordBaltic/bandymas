import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../loginsystem/AuthProvider";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link href="/">
                    <img src="/logo.svg" alt="NordBalticum" className="logo" />
                </Link>
            </div>

            <ul className={`navbar-links ${isOpen ? "open" : ""}`}>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/stake">Staking</Link></li>
                <li><Link href="/swap">Swap</Link></li>
                <li><Link href="/donate">Donations</Link></li>
            </ul>

            <div className="auth-buttons">
                {!user ? (
                    <>
                        <Link href="/login" className="login-btn">Email Login</Link>
                        <button className="wallet-login-btn">Wallet Login</button>
                    </>
                ) : (
                    <button className="logout-btn" onClick={logout}>Logout</button>
                )}
            </div>

            <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
                <img src="/menu-icon.svg" alt="Menu" />
            </button>
        </nav>
    );
}
