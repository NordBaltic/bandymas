import '../styles/globals.css';
import '../styles/theme.css';
import { AuthProvider } from '../context/AuthContext';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

// ✅ Web3 konfiguracija (BSC)
const { chains, publicClient } = configureChains(
    [mainnet],
    [publicProvider()]
);

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
                    >
                        <Navbar />
                        <Component {...pageProps} />
                    </motion.div>
                </AuthProvider>
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
