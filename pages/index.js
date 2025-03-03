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

    return (
        <div className="container">
            {router.pathname !== '/' && <Navbar />}

            <motion.main 
                className="login-container"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.img 
                    src="/logo.png" 
                    alt="NordBalticum Logo" 
                    className="logo"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                />

                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="title"
                >
                    🚀 Welcome to <span className="highlight">NordBalticum</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="subtitle"
                >
                    The Future of Secure & Decentralized Banking
                </motion.p>

                <div className="button-container">
                    <motion.button 
                        className="login-email-btn"
                        whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255, 215, 0, 0.7)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/email-icon.svg" alt="Email Login" className="button-icon" />
                        LOGIN WITH EMAIL
                    </motion.button>

                    <motion.button 
                        className="login-wallet-btn"
                        whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0, 255, 150, 0.7)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/wallet-icon.svg" alt="Wallet Login" className="button-icon" />
                        LOGIN WITH WALLET
                    </motion.button>
                </div>

                <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="register-text"
                >
                    New here? <a href="/register" className="register-link">Create an Account</a>
                </motion.p>
            </motion.main>
        </div>
    );
}
