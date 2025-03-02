import { getUserWallet, createWalletForUser } from '../lib/api';

export const connectWallet = async (userId) => {
    const wallet = await getUserWallet(userId);
    return wallet;
};
