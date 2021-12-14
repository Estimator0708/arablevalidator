const Web3 = require('web3');
const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc')

async function getPrices(allPrices){
    try{
        const bnbPrice =  allPrices.coingecko.priceJob.binancecoin.usd
        const bnbPriceHex =  web3.utils.toHex(web3.utils.toWei(`${bnbPrice}`, 'ether'))
        const cakePrice = allPrices.bsc.pancakeswap.cakeBnb.cakePrice
        const cakePriceHex =  web3.utils.toHex(web3.utils.toWei(`${cakePrice}`, 'ether'))
        const busdBNBLpPrice = allPrices.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice.lpTokenPrice
        const busdBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${busdBNBLpPrice}`, 'ether'))
        const cakeBNBLpPrice = allPrices.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice.lpTokenPrice
        const cakeBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${cakeBNBLpPrice}`, 'ether'))
        const sushiPrice = allPrices.coingecko.priceJob.sushi.usd
        const sushiPriceHex = web3.utils.toHex(web3.utils.toWei(`${sushiPrice}`, 'ether'))
        const solPrice = allPrices.coingecko.priceJob.solana.usd
        const solPriceHex = web3.utils.toHex(web3.utils.toWei(`${solPrice}`, 'ether'))
        const osmoPrice = allPrices.coingecko.priceJob.osmosis.usd
        const osmoPriceHex = web3.utils.toHex(web3.utils.toWei(`${osmoPrice}`, 'ether'))
        const quickPrice = allPrices.coingecko.priceJob.quick.usd
        const quickPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickPrice}`, 'ether'))
        //ReferenceError: dao is not defined. happening coz of id: curve-dao-token
        // const crvPrice = allPrices.coingecko.priceJob.curve.usd
        // const crvPriceHex = web3.utils.toHex(web3.utils.toWei(`${crvPrice}`, 'ether'))
        const rayPrice = allPrices.coingecko.priceJob.raydium.usd
        const rayPriceHex = web3.utils.toHex(web3.utils.toWei(`${rayPrice}`, 'ether'))
        const dotPrice = allPrices.coingecko.priceJob.polkadot.usd
        const dotPriceHex = web3.utils.toHex(web3.utils.toWei(`${dotPrice}`, 'ether'))
        const truPrice = allPrices.coingecko.priceJob.truefi.usd
        const truPriceHex = web3.utils.toHex(web3.utils.toWei(`${truPrice}`, 'ether'))
        const RaydiumRAYSOLPrice = allPrices.solana.raydium.raySol.lp_price
        const RaydiumRAYSOLPriceHex =  web3.utils.toHex(web3.utils.toWei(`${RaydiumRAYSOLPrice}`, 'ether'))
        const RaydiumRAYUSDTPrice = allPrices.solana.raydium.rayUsdt.lp_price
        const RaydiumRAYUSDTPriceHex =  web3.utils.toHex(web3.utils.toWei(`${RaydiumRAYUSDTPrice}`, 'ether'))
        const UniswapETHUSDTPrice = allPrices.eth.ethdata.ethUsdt.ethUsdtLpTokenPrice.lpTokenPrice
        const UniswapETHUSDTPriceHex =  web3.utils.toHex(web3.utils.toWei(`${UniswapETHUSDTPrice}`, 'ether'))
        const SushiswapETHTRUPrice = allPrices.eth.ethdata.ethTru.truEthLpTokenPrice.lpTokenPrice
        const SushiswapETHTRUPriceHex =  web3.utils.toHex(web3.utils.toWei(`${SushiswapETHTRUPrice}`, 'ether'))
        const quickswapETHQUICKPrice = allPrices.poly.polygonData.quickEth.quickEthLpTokenPrice
        const quickswapETHQUICKPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickswapETHQUICKPrice}`, 'ether'))
        const quickswapETHUSDCPrice = allPrices.poly.polygonData.ethUsdc.ethUsdcLpTokenPrice
        const quickswapETHUSDCPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickswapETHUSDCPrice}`, 'ether'))

        return{
            bnbPrice, cakePrice, busdBNBLpPrice, cakeBNBLpPrice, sushiPrice, solPrice, osmoPrice, quickPrice, rayPrice, dotPrice, truPrice, bnbPriceHex, cakePriceHex, busdBNBLpPriceHex, cakeBNBLpPriceHex, sushiPriceHex, solPriceHex, osmoPriceHex,
            quickPriceHex, rayPriceHex, dotPriceHex, truPriceHex, RaydiumRAYSOLPriceHex, RaydiumRAYUSDTPriceHex, UniswapETHUSDTPriceHex,
            SushiswapETHTRUPriceHex, quickswapETHQUICKPriceHex, quickswapETHUSDCPriceHex,
        }
}
 catch(error){
     console.log(error)
 }
}

exports.getPrices = getPrices