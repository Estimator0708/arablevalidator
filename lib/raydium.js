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

const getMainnetRaydiumPools = async () => {
  const poolsRet = await axios.get("https://sdk.raydium.io/liquidity/mainnet.json").then(resp => resp.data)
  return poolsRet.official.map((p) => jsonInfo2PoolKeys(p))
};

exports.getLpPoolPrice = (pair) => {
    pair = pair.toUpperCase()
    let lpTokens = Object.values(MAINNET_LP_TOKENS).filter(lp => lp.symbol == pair).sort((lp1, lp2) => lp2.version.compareTo(lp1.version))
    if (lpTokens.length == 0) {
      throw pair + ' not found'
    }
    let lpToken = lpTokens[0]
    let liquidityPool = MAINNET_LIQUIDITY_POOLS.filter((lp) => lp.lp == lpToken)[0]
    
    var connection = new Connection(
        clusterApiUrl('mainnet-beta'),
        'confirmed',
    );
    let getPoolKey = getMainnetRaydiumPools().then((poolKeys) => {
        return poolKeys.filter((pk) => pk.id.toString(64) == liquidityPool.id)[0]
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