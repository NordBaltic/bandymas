import { useEffect, useState } from "react";
import { useAuth } from "../loginsystem/AuthProvider";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const PANCAKESWAP_IFRAME = "https://pancakeswap.finance/swap";

export default function Swap() {
    const { user, wallet } = useAuth();
    const [swapWallet, setSwapWallet] = useState("");

    useEffect(() => {
        if (user) {
            fetchWallet();
        }
    }, [user]);

    const fetchWallet = async () => {
        if (wallet) {
            setSwapWallet(wallet);
        } else {
            const { data } = await supabase.from("users").select("wallet").eq("id", user.id).single();
            if (data?.wallet) {
                setSwapWallet(data.wallet);
            } else {
                toast.error("No wallet found, please set up your wallet.");
            }
        }
    };

    return (
        <div className="swap-container">
            <h2>Swap Tokens</h2>
            <p>Exchange tokens seamlessly using PancakeSwap.</p>

            {swapWallet ? (
                <>
                    <iframe
                        src={PANCAKESWAP_IFRAME}
                        width="100%"
                        height="600px"
                        className="swap-iframe"
                    ></iframe>
                    <p>Your connected wallet: <strong>{swapWallet}</strong></p>
                </>
            ) : (
                <p className="error-text">No wallet connected. Please log in.</p>
            )}
        </div>
    );
}
