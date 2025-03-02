import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function useWeb3() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  return {
    connect,
    connectors,
    disconnect,
    address,
    isConnected,
  };
}
