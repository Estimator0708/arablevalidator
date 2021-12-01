const {
  Connection,
  clusterApiUrl,
} = require('@solana/web3.js')
const {
  Currency,
  Price,
  Liquidity,
  jsonInfo2PoolKeys,
  MAINNET_LIQUIDITY_POOLS,
  MAINNET_LP_TOKENS,
} = require("@raydium-io/raydium-sdk")
const axios = require('axios')

const SUPPORTED_LIQUIDITY_POOLS = {
  'RAY-SOL': MAINNET_LIQUIDITY_POOLS.filter((lp) => lp.lp == MAINNET_LP_TOKENS.RAY_SOL_V4)[0],
  'RAY-USDT': MAINNET_LIQUIDITY_POOLS.filter((lp) => lp.lp == MAINNET_LP_TOKENS.RAY_USDT_V4)[0],
}

const LP_TOKENS = {
  'RAY-SOL': MAINNET_LP_TOKENS.RAY_SOL_V4,
  'RAY-USDT': MAINNET_LP_TOKENS.RAY_USDT_V4,
}

const getMainnetRaydiumPools = async () => {
  const poolsRet = await axios.get("https://sdk.raydium.io/liquidity/mainnet.json").then(resp => resp.data)
  return poolsRet.official.map((p) => jsonInfo2PoolKeys(p))
};

exports.getLpPoolPrice = (pair) => {
    pair = pair.toUpperCase()
    if (!Object.keys(SUPPORTED_LIQUIDITY_POOLS).includes(pair)) {
        throw pair + ' not supported'
    }
    lpId = SUPPORTED_LIQUIDITY_POOLS[pair].id
    lpToken = LP_TOKENS[pair]
    
    var connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed',
    );
    let getPoolKey = getMainnetRaydiumPools().then((poolKeys) => {
        return poolKeys.filter((pk) => pk.id.toString(64) == lpId)[0]
    })
    let getPoolInfo = getPoolKey.then((poolKey) => {
        return Liquidity.getInfo({
          poolKeys: poolKey,
          connection: connection,
      })
    })
    // allows using poolKey and poolInfo in another async function
    return Promise.all([getPoolKey, getPoolInfo]).then(function([poolKey, poolInfo]) {
      console.log('poolKey: ' + JSON.stringify(poolKey, null, 2))
      console.log('poolInfo: ' + JSON.stringify(poolInfo, null, 2))

      let price = new Price(
        new Currency(poolInfo.baseDecimals, lpToken.base.symbol, lpToken.base.name),
        new Currency(poolInfo.quoteDecimals, lpToken.quote.symbol, lpToken.quote.name),
        poolInfo.baseBalance.toString(),
        poolInfo.quoteBalance.toString(),
      )
      return price.raw.toSignificant(15);
    })
}