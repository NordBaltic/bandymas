import { Trade, Route, Token, CurrencyAmount, TradeType } from '@pancakeswap/sdk';
import { ChainId } from '@pancakeswap/v3-sdk';

// BSC Mainnet
const BNB = new Token(ChainId.BSC, "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", 18);

export async function getTradeDetails(tokenA, tokenB, amount) {
  const route = new Route([tokenA, tokenB], tokenA, tokenB);
  const trade = new Trade(route, CurrencyAmount.fromRawAmount(tokenA, amount), TradeType.EXACT_INPUT);

  return trade;
}
