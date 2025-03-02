import { getDefaultWallets, RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, arbitrum, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

// Konfigūruojame grandines
const { chains, publicClient } = configureChains(
  [mainnet, arbitrum, polygon],
  [publicProvider()]
);

// Gauti pinigines pagal numatytą `rainbowkit`
const { wallets } = getDefaultWallets({
  appName: "Nord Balticum",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  chains
});

// Sukuriame adapterius piniginėms
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: connectorsForWallets([...wallets]),
  publicClient
});

export { WagmiConfig, RainbowKitProvider, wagmiConfig, chains };
