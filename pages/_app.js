import '../styles/globals.css';
import '../styles/theme.css';
import '../styles/admin.css';
import '../styles/index.css';
import '../styles/Loading.css';
import '../styles/profile.css';
import '../styles/receive.css';
import "../styles/send.css";
import "../styles/stake.css";
import "../styles/walletConnectButton.css";

import { AuthProvider } from "../loginsystem/AuthProvider";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';

// Navbar įkėlimas tik klientinėje pusėje (fix "Navbar is not defined" klaidoms)
const Navbar = dynamic(() => import("../components/Navbar"), { ssr: false });

const { chains, publicClient } = configureChains([bsc], [publicProvider()]);

const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
});

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();

    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains} theme={darkTheme()}>
                <AuthProvider>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="app-container"
                    >
                        {/* Navbar rodomas visur, išskyrus pagrindiniame puslapyje */}
                        {router.pathname !== '/' && <Navbar />}
                        <Component {...pageProps} />
                    </motion.div>
                </AuthProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
