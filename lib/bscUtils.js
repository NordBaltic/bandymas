import { ethers } from "ethers";

const BSC_RPC = "https://bsc-dataseed.binance.org/";

export async function getBscBalance(address) {
    if (!address) return "0.00";
    
    const provider = new ethers.JsonRpcProvider(BSC_RPC);
    const balance = await provider.getBalance(address);
    
    return ethers.utils.formatEther(balance);
}
