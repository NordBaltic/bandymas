import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const userLoggedIn = localStorage.getItem("user");
        if (userLoggedIn) {
            router.push("/dashboard");
        }
    }, []);

    useEffect(() => {
        const adjustSize = () => {
            const container = document.querySelector(".login-container");
            if (container) {
                if (window.innerWidth > 1024) {
                    container.style.width = "850px";
                    container.style.maxWidth = "92vw";
                    container.style.border = "none";
                    container.style.boxShadow = "none";
                } else {
                    container.style.width = "90%";
                    container.style.maxWidth = "480px";
                }
            }
        };
        adjustSize();
        window.addEventListener("resize", adjustSize);
        return () => window.removeEventListener("resize", adjustSize);
    }, []);

    const handleEmailLogin = () => {
        router.push("/login-email");
    };

    const handleWalletLogin = () => {
        router.push("/login-wallet");
    };

    const handleRegister = () => {
        router.push("/register");
    };

    return (
        <div className="container">
            {router.pathname !== '/' && <Navbar />}

            <motion.main 
                className="login-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
            >
                <motion.img
                    src="/icons/nb-logo.svg"
                    alt="Nord Balticum Logo"
                    className="logo"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                />

                <div className="button-container">
                    <motion.button 
                        className="login-email-btn"
                        onClick={handleEmailLogin}
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/icons/email-icon.svg" alt="Email Login" className="button-icon" />
                        <span className="login-text">Login</span>
                    </motion.button>

                    <motion.button 
                        className="login-wallet-btn"
                        onClick={handleWalletLogin}
                        whileHover={{ scale: 1.1, rotate: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/icons/wallet-icon.svg" alt="Wallet Login" className="button-icon" />
                        <span className="login-text">Login</span>
                    </motion.button>
                </div>

                <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="register-text"
                >
                    New here? <a onClick={handleRegister} className="register-link">Create an Account</a>
                </motion.p>
            </motion.main>
        </div>
    );
}
