import { useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        // Jei vartotojas jau prisijungęs, nukreipiam į dashboard
        const userLoggedIn = localStorage.getItem("user");
        if (userLoggedIn) {
            router.push("/dashboard");
        }
    }, []);

    return (
        <div className="container">
            {router.pathname !== '/' && <Navbar />} {/* Paslepia navbar pagrindiniame puslapyje */}

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
                />

                <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    🚀 Welcome to <span className="highlight">NordBalticum</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                >
                    The Future of Secure & Decentralized Banking
                </motion.p>
                
                <motion.button 
                    className="login-email-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    📩 LOGIN WITH EMAIL
                </motion.button>

                <motion.button 
                    className="login-wallet-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    🔗 LOGIN WITH WALLET
                </motion.button>

                <label className="remember-me">
                    <input type="checkbox" />
                    Remember Me
                    <span className="tooltip">Keep me logged in for 30 days</span>
                </label>

                <p>
                    New here? <a href="/register" className="register-link">Create an Account</a>
                </p>
            </motion.main>
        </div>
    );
}
