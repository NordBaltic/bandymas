import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createStorage, cookieStorage } from '@wagmi/core';
import { mainnet, arbitrum } from '@reown/appkit/networks';

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, arbitrum],
  projectId,
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
});
