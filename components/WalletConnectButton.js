import { useWallet } from "../lib/rainbowKit";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import "../styles/WalletConnectButton.css";

export default function WalletConnectButton() {
  const { login, isConnected, address, logout } = useWallet();
  const [loading, setLoading] = useState(false);
  const [shortAddress, setShortAddress] = useState("");

  // ✅ Automatiškai sutrumpina piniginės adresą UI rodymui
  useEffect(() => {
    if (address) {
      setShortAddress(`${address.slice(0, 6)}...${address.slice(-4)}`);
    }
  }, [address]);

  // 🔥 Prisijungimo funkcija su klaidų prevencija
  const handleLogin = async () => {
    setLoading(true);
    try {
      await login();
      toast.success("✅ Wallet connected successfully!");
    } catch (error) {
      console.error("❌ Wallet connection failed:", error);
      toast.error("⚠️ Failed to connect wallet.");
    }
    setLoading(false);
  };

  // 🔥 Atsijungimo funkcija su klaidų prevencija
  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      toast.success("👋 Wallet disconnected!");
    } catch (error) {
      console.error("❌ Wallet disconnect failed:", error);
      toast.error("⚠️ Failed to disconnect.");
    }
    setLoading(false);
  };

  return (
    <div className="wallet-container fade-in">
      {isConnected ? (
        <div className="connected-box glass-morph">
          <p className="status-text">✅ Connected</p>
          <p className="wallet-address">{shortAddress}</p>
          <button
            className="wallet-button logout"
            onClick={handleLogout}
            disabled={loading}
          >
            <img src="/icons/logout.svg" className="button-icon" alt="Logout" />
            <span>{loading ? "Disconnecting..." : "Disconnect"}</span>
          </button>
        </div>
      ) : (
        <button
          className="wallet-button connect"
          onClick={handleLogin}
          disabled={loading}
        >
          <img
            src="/icons/walletconnect.svg"
            className="button-icon"
            alt="WalletConnect"
          />
          <span>{loading ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      )}
    </div>
  );
}
