import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import toast from "react-hot-toast";

export function useWeb3() {
  const { connect, connectors, isLoading } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [walletAddress, setWalletAddress] = useState(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      setWalletAddress(address);
      localStorage.setItem("walletAddress", address);
    } else {
      localStorage.removeItem("walletAddress");
    }
  }, [isConnected, address]);

  // ✅ Prisijungimo funkcija su saugumo patikra
  const handleConnect = async (connector) => {
    try {
      setConnecting(true);
      await connect({ connector });
      toast.success("✅ Wallet connected!");
    } catch (error) {
      console.error("⚠️ Connection failed:", error);
      toast.error("❌ Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  };

  // ✅ Atsijungimo funkcija su visų duomenų išvalymu
  const handleDisconnect = () => {
    disconnect();
    setWalletAddress(null);
    localStorage.removeItem("walletAddress");
    toast.success("👋 Wallet disconnected!");
  };

  return {
    connect: handleConnect,
    connectors,
    disconnect: handleDisconnect,
    address: walletAddress,
    isConnected,
    isLoading,
    connecting,
  };
}
