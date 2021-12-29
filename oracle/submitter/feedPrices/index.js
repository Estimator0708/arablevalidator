const { getNetwork } = require('../utils/getNetworkId');
const { setBulkPrice } = require('../utils/setBulkPrice');

async function feedPrices(state) {
  try {
    const {
      arBNB,
      arCAKE,
      arPancakeswapBUSDBNB,
      arPancakeswapCAKEBNB,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arQuickswapETHUSDC,
      arQuickswapETHQUICK,
      arRaydiumRAYSOL,
      arRaydiumRAYUSDT,
      arUniswapETHUSDT,
      arSushiswapETHTRU,
      arOsmosisATOMOSMO,
    } = await getAddresses();
    const bnbPrice = state.coingecko.prices.binancecoin.usd;
    const cakePrice = state.bsc.pancakeswap.cakeBnb.cakePrice;
    const busdBNBLpPrice =
      state.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice.lpTokenPrice;
    const cakeBNBLpPrice =
      state.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice.lpTokenPrice;
    const sushiPrice = state.coingecko.prices.sushi.usd;
    const solPrice = state.coingecko.prices.solana.usd;
    const osmoPrice = state.coingecko.prices.osmosis.usd;
    const quickPrice = state.coingecko.prices.quick.usd;
    const crvPrice = state.eth.ethdata.threePool.crvPrice;
    const rayPrice = state.coingecko.prices.raydium.usd;
    const dotPrice = state.coingecko.prices.polkadot.usd;
    const truPrice = state.coingecko.prices.truefi.usd;
    const raydiumRAYSOLPrice = state.solana.raydium.raySol.lp_price;
    const raydiumRAYUSDTPrice = state.solana.raydium.rayUsdt.lp_price;
    const uniswapETHUSDTPrice =
      state.eth.ethdata.ethUsdt.ethUsdtLpTokenPrice.lpTokenPrice;
    const sushiswapETHTRUPrice =
      state.eth.ethdata.ethTru.truEthLpTokenPrice.lpTokenPrice;
    const quickswapETHQUICKPrice =
      state.poly.polygonData.quickEth.quickEthLpTokenPrice;
    const quickswapETHUSDCPrice =
      state.poly.polygonData.ethUsdc.ethUsdcLpTokenPrice;
    const atomOsmoLpTokenPrice = state.osmosis.atomOsmoLpTokenPrice;

    /**user readable price -- end **/
    /**Array of all address**/
    let tokensArray = [
      arBNB,
      arCAKE,
      arPancakeswapBUSDBNB,
      arPancakeswapCAKEBNB,
      arSUSHI,
      arSOL,
      arOSMO,
      arQUICK,
      arRAY,
      arDOT,
      arTRU,
      arCRV,
      arQuickswapETHUSDC,
      arQuickswapETHQUICK,
      arRaydiumRAYSOL,
      arRaydiumRAYUSDT,
      arUniswapETHUSDT,
      arSushiswapETHTRU,
      arOsmosisATOMOSMO,
    ];
    /**Array of all address's price**/
    let priceArray = [
      bnbPrice,
      cakePrice,
      busdBNBLpPrice,
      cakeBNBLpPrice,
      sushiPrice,
      solPrice,
      osmoPrice,
      quickPrice,
      rayPrice,
      dotPrice,
      truPrice,
      crvPrice,
      quickswapETHUSDCPrice,
      quickswapETHQUICKPrice,
      raydiumRAYSOLPrice,
      raydiumRAYUSDTPrice,
      uniswapETHUSDTPrice,
      sushiswapETHTRUPrice,
      atomOsmoLpTokenPrice,
    ];

    await setBulkPrice(tokensArray, priceArray);
  } catch (error) {
    console.log(error);
  }
}

exports.feedPrices = feedPrices;
