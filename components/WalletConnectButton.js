import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import toast from "react-hot-toast";
import "../styles/walletConnectButton.css";

export default function WalletConnectButton() {
    const { loginWithWallet, wallet } = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (wallet) {
            toast.success("✅ Wallet Connected!");
        }
    }, [wallet]);

    return (
        <button
            className="wallet-connect-btn"
            onClick={async () => {
                setLoading(true);
                await loginWithWallet();
                setLoading(false);
            }}
            disabled={loading}
        >
            {loading ? "🔄 Connecting..." : "🔗 Connect Wallet"}
        </button>
    );
}
