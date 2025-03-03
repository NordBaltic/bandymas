export async function getStakingInfo(walletAddress) {
    try {
        const response = await fetch(`https://api.marinade.finance/staking/${walletAddress}`);
        const data = await response.json();
        
        return {
            staked: data.stakedAmount || "0.00",
            rewards: data.pendingRewards || "0.00",
        };
    } catch (error) {
        console.error("Error fetching staking data:", error);
        return { staked: "0.00", rewards: "0.00" };
    }
}
