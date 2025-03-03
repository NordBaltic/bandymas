import { useAuth } from "../loginsystem/AuthProvider";
import { useEffect, useState } from "react";
import QRCode from "qrcode.react";
import { supabase } from "../lib/supabaseClient";

export default function ReceiveTransaction() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState("");

    useEffect(() => {
        async function fetchWallet() {
            const { data: walletData } = await supabase
                .from("users")
                .select("wallet")
                .eq("id", user.id)
                .single();

            if (walletData?.wallet) {
                setWallet(walletData.wallet);
            }
        }
        if (user) fetchWallet();
    }, [user]);

    return (
        <div className="receive-container">
            <h3>📥 Receive BNB</h3>
            {wallet ? (
                <>
                    <QRCode value={wallet} size={150} />
                    <p className="wallet-address">{wallet}</p>
                    <button onClick={() => navigator.clipboard.writeText(wallet)}>
                        📋 Copy Address
                    </button>
                </>
            ) : <p>Loading wallet...</p>}
        </div>
    );
            }
