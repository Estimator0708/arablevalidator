const {
  Connection,
  clusterApiUrl,
  PublicKey
} = require('@solana/web3.js')
const {
  Currency,
  Price,
  Liquidity,
  jsonInfo2PoolKeys,
  MAINNET_LIQUIDITY_POOLS,
  MAINNET_LP_TOKENS,
  LIQUIDITY_STATE_LAYOUT_V4,
} = require("@raydium-io/raydium-sdk")
const {
  Market
} = require("@project-serum/serum")
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
    console.log('Computing LP Pool Price for ' + pair)
    
    var connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');

    let getLiquidityPoolState = connection.getAccountInfo(new PublicKey(liquidityPool.id))
    .then(accountInfo => {
      let state = LIQUIDITY_STATE_LAYOUT_V4.decode(accountInfo.data)
      // console.log('liquidity state layout: ' + JSON.stringify(state, null, 2))
      return state
    })
    let getOpenOrders = getLiquidityPoolState.then(lpState => {
      let openOrdersKey = new PublicKey(lpState.openOrders);
      console.log('open orders key: ' + openOrdersKey.toBase58())
      return connection.getAccountInfo(openOrdersKey)
      .then(accountInfo => {
        return Market.getLayout(lpState.openOrders).decode(accountInfo.data)
      })
    })
    let getQuoteVaultBalance = getLiquidityPoolState.then(lpState => {
      const quoteVaultKey = new PublicKey(lpState.quoteVault);
      console.log('quote vault key: ' + quoteVaultKey.toBase58())
      return connection.getBalance(quoteVaultKey)
    })
    let getBaseVaultBalance = getLiquidityPoolState.then(lpState => {
      const baseVaultKey = new PublicKey(lpState.baseVault);
      console.log('base vault key: ' + baseVaultKey.toBase58())
      return connection.getBalance(baseVaultKey)
    })
    let getLpMintSupply = getLiquidityPoolState.then(lpState => {
      const lpMintKey = new PublicKey(lpState.lpMint);
      console.log('lp mint key: ' + lpMintKey.toBase58())
      return connection.getTokenSupply(lpMintKey)
    })
    return Promise.all(
      [getLiquidityPoolState, getOpenOrders, getQuoteVaultBalance, getBaseVaultBalance, getLpMintSupply]
    ).then(function(
      [lpState, openOrders, quoteVaultBalance, baseVaultBalance, lpMintSupply]
    ) {
      console.log('pool state: ' + JSON.stringify(lpState, null, 2))
      console.log('open orders: ' + JSON.stringify(openOrders, null, 2))

      // pool_total_base = liquidity_state_layout.quoteVault.balance + liquidity_state_layout.openOrders.total_quote - liquidity_state_layout.quoteNeedTakePnl
      let poolTotalBase = quoteVaultBalance + openOrders.quoteDepositsTotal - lpState.quoteNeedTakePnl
      // pool_total_quote = liquidity_state_layout.baseVault.balance + liquidity_state_layout.openOrders.total_base - liquidity_state_layout.baseNeedTakePnl
      let poolTotalQuote = baseVaultBalance + openOrders.baseDepositsTotal - lpState.baseNeedTakePnl
      // pool_total_lp = liquidity_state_layout.lpMint.supply
      let poolTotalLp = lpMintSupply.value.uiAmount
      console.log('lp mint supply: ' + JSON.stringify(lpMintSupply, null, 2))
      // base_per_lp = pool_total_base / pool_total_lp
      let basePerLp = poolTotalBase / poolTotalLp
      // quote_per_lp = pool_total_quote / pool_total_lp
      let quotePerLp = poolTotalQuote / poolTotalLp
      console.log('quote vault balance: ' + quoteVaultBalance)
      console.log('base vault balance: ' + baseVaultBalance)
      console.log('open orders quote balance: ' + openOrders.quoteDepositsTotal)
      console.log('open orders base balance: ' + openOrders.baseDepositsTotal)
      console.log('pool total base: ' + poolTotalBase)
      console.log('pool total quoute: ' + poolTotalQuote)
      console.log('pool total LP: ' + poolTotalLp)
      console.log('base per lp: ' + basePerLp)
      console.log('quote per lp: ' + quotePerLp)
      return 1/quotePerLp
    })
}