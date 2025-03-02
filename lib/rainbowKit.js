import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const login = () => {
    if (!isConnected) {
      connect({ connector: connectors[0] });
    }
  };

  const logout = () => {
    disconnect();
  };

  return { address, isConnected, login, logout };
}
