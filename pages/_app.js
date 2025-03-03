import '../styles/globals.css';
import '../styles/theme.css';
import '../styles/admin.css';
import '../styles/index.css';
import '../../styles/navbar.module.css';
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
import Navbar from "../components/Navbar";

const { chains, publicClient } = configureChains([bsc], [publicProvider()]);

const wagmiConfig = createConfig({
    autoConnect: true,
    publicClient,
});

export default function MyApp({ Component, pageProps }) {
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
                        <Navbar />
                        <Component {...pageProps} />
                    </motion.div>
                </AuthProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
