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
                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="title"
                >
                    Welcome to <span className="highlight">NordBalticum</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="subtitle"
                >
                    The Future of Secure & Decentralized Banking
                </motion.p>

                <div className="button-container">
                    <motion.button 
                        className="login-email-btn"
                        onClick={handleEmailLogin}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/icons/email-icon.svg" alt="Email Login" className="button-icon" />
                        Login with Email
                    </motion.button>

                    <motion.button 
                        className="login-wallet-btn"
                        onClick={handleWalletLogin}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <img src="/icons/wallet-icon.svg" alt="Wallet Login" className="button-icon" />
                        Login with Wallet
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
