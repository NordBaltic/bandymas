export const getUserWallet = (userId) => {
    return { walletAddress: "0x12345" };
};

export const createWalletForUser = (userId) => {
    return { success: true, walletAddress: "0xABCDE" };
};

export const updateProfile = (userId, data) => {
    return { success: true };
};

export const requestAccountDeletion = (userId) => {
    return { success: true };
};

export const fetchBalanceData = async () => {
    return { balance: "3.5" }; // Simuliuotas balansas ETH
};
