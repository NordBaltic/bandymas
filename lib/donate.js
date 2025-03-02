// lib/donate.js
import { ethers } from 'ethers';

const BSC_MAINNET_RPC = process.env.NEXT_PUBLIC_BSC_RPC;
const ADMIN_DONATE_WALLET = process.env.NEXT_PUBLIC_ADMIN_DONATE_WALLET;

const CHARITY_WALLETS = {
    "Red Cross": process.env.NEXT_PUBLIC_REDCROSS_WALLET,
    "Children’s Foundation": process.env.NEXT_PUBLIC_CHILDREN_WALLET,
    "Nature Protection Fund": process.env.NEXT_PUBLIC_NATURE_WALLET,
};

export async function donateToCharity(userAddress, amount, charity) {
    const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_RPC);
    const wallet = new ethers.Wallet(process.env.NEXT_PUBLIC_PRIVATE_KEY, provider);
    const signer = wallet.connect(provider);

    try {
        const adminFee = ethers.utils.parseEther((amount * 0.03).toFixed(6));
        const finalAmount = ethers.utils.parseEther((amount * 0.97).toFixed(6));

        // Siunčiame 3% į Admin Wallet
        const transferFeeTx = await signer.sendTransaction({
            to: ADMIN_DONATE_WALLET,
            value: adminFee
        });
        await transferFeeTx.wait();

        // Siunčiame likusius 97% į pasirinkto labdaros fondo piniginę
        const charityAddress = CHARITY_WALLETS[charity];
        const transferTx = await signer.sendTransaction({
            to: charityAddress,
            value: finalAmount
        });
        await transferTx.wait();

        console.log(`Donation of ${amount} BNB to ${charity} was successful!`);
        return true;
    } catch (error) {
        console.error("Donation failed:", error);
        return false;
    }
}
