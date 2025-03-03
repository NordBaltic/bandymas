import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { ethers } from "ethers";
import { useAuth } from "./useAuth";

export function useBscWallet() {
    const { user } = useAuth();
    const [wallet, setWallet] = useState(null);

    useEffect(() => {
        if (user) {
            fetchWallet(user.id);
        }
    }, [user]);

    const fetchWallet = async (userId) => {
        const { data, error } = await supabase
            .from("users")
            .select("wallet_address")
            .eq("id", userId)
            .single();

        if (data) {
            setWallet(data.wallet_address);
        } else if (!error) {
            generateAndStoreWallet(userId);
        }
    };

    const generateAndStoreWallet = async (userId) => {
        const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase; // Sugeneruojame mnemoniką
        const wallet = ethers.Wallet.fromMnemonic(mnemonic); // Gauname tikrą BSC piniginę

        // Saugojame tik viešą adresą
        const { error } = await supabase
            .from("users")
            .update({ wallet_address: wallet.address })
            .eq("id", userId);

        if (!error) {
            setWallet(wallet.address);
            localStorage.setItem(`wallet_mnemonic_${userId}`, mnemonic); // Tik vietinė saugykla
        }
    };

    return { wallet, generateAndStoreWallet };
}
