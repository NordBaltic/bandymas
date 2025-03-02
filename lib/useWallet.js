import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { getUserWallet } from './api';

export function useWallet(userId) {
    const { address, isConnected } = useAccount();
    const { connect } = useConnect({ connector: new InjectedConnector() });
    const { disconnect } = useDisconnect();
    const [wallet, setWallet] = useState(null);
    
    useEffect(() => {
        async function loadWallet() {
            if (userId) {
                let userWallet = await getUserWallet(userId);
                if (userWallet) setWallet(userWallet);
            }
        }
        loadWallet();
    }, [userId]);

    return { address, isConnected, connect, disconnect, wallet };
}
