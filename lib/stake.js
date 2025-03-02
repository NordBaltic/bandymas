// lib/stake.js
import { ethers } from 'ethers';
import { supabase } from './supabaseClient';

const BSC_MAINNET_RPC = process.env.NEXT_PUBLIC_BSC_RPC;
const MARINADE_API = process.env.NEXT_PUBLIC_MARINADE_API;
const STAKE_FEE_WALLET = process.env.NEXT_PUBLIC_STAKE_FEE_WALLET;

export async function performStaking(userAddress, amount, pool) {
    const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const signer = wallet.connect(provider);

    try {
        // 4% mokesčio skaičiavimas prieš staking
        const adminFee = ethers.utils.parseEther((amount * 0.04).toFixed(6));
        const finalAmount = ethers.utils.parseEther((amount * 0.96).toFixed(6));

        // Perduoti 4% fee Admin Wallet'ui
        const transferFeeTx = await signer.sendTransaction({
            to: STAKE_FEE_WALLET,
            value: adminFee
        });
        await transferFeeTx.wait();

        // Stake logika
        const stakeTx = await fetch(`${MARINADE_API}/stake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: userAddress,
                amount: finalAmount,
                pool
            })
        });

        const stakeResponse = await stakeTx.json();
        if (stakeResponse.success) {
            console.log("Stake successful!");
            return true;
        } else {
            console.error("Staking failed:", stakeResponse.error);
            return false;
        }
    } catch (error) {
        console.error("Staking error:", error);
        return false;
    }
}

export async function withdrawStaking(userAddress, amount) {
    const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const signer = wallet.connect(provider);

    try {
        // 4% fee prieš išsiimant
        const adminFee = ethers.utils.parseEther((amount * 0.04).toFixed(6));
        const finalAmount = ethers.utils.parseEther((amount * 0.96).toFixed(6));

        // Perduoti 4% fee Admin Wallet'ui
        const transferFeeTx = await signer.sendTransaction({
            to: STAKE_FEE_WALLET,
            value: adminFee
        });
        await transferFeeTx.wait();

        // Withdraw logika
        const withdrawTx = await fetch(`${MARINADE_API}/unstake`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user: userAddress,
                amount: finalAmount
            })
        });

        const withdrawResponse = await withdrawTx.json();
        if (withdrawResponse.success) {
            console.log("Withdrawal successful!");
            return true;
        } else {
            console.error("Withdrawal failed:", withdrawResponse.error);
            return false;
        }
    } catch (error) {
        console.error("Withdrawal error:", error);
        return false;
    }
}
