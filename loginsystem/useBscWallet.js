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
        const newWallet = generateBscWallet();

        const { error } = await supabase
            .from("users")
            .update({ wallet_address: newWallet })
            .eq("id", userId);

        if (!error) {
            setWallet(newWallet);
        }
    };

    const generateBscWallet = () => {
        const wallet = ethers.Wallet.createRandom();
        return wallet.address;
    };

    return { wallet, generateAndStoreWallet };
}
