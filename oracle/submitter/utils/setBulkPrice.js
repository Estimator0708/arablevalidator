const Web3 = require('web3');
const {fuji_url, avax_url} = require('../../config/config.rpc');
const { oracle, arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB,
    arSUSHI, arSOL, arOSMO, arQUICK, arCRV, arRAY, arDOT, arTRU, arOsmosisATOMOSMO, arQuickswapETHUSDC,
    arQuickswapETHQUICK, arRaydiumRAYSOL, arRaydiumRAYUSDT, arUniswapETHUSDT, arCurveDAIUSDCUSDT, arSushiswapETHTRU } = require ('../lib/address.js');
const {oracle_abi} = require ('../lib/contract_abi')
const web3 = new Web3(fuji_url)

async function getPrices(allPrices){
    try{
        const bnbPrice =  allPrices.coingecko.prices.binancecoin.usd
        const bnbPriceHex =  web3.utils.toHex(web3.utils.toWei(`${bnbPrice}`, 'ether'))
        const cakePrice = allPrices.bsc.pancakeswap.cakeBnb.cakePrice
        const cakePriceHex =  web3.utils.toHex(web3.utils.toWei(`${cakePrice}`, 'ether'))
        const busdBNBLpPrice = allPrices.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice.lpTokenPrice
        const busdBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${busdBNBLpPrice}`, 'ether'))
        const cakeBNBLpPrice = allPrices.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice.lpTokenPrice
        const cakeBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${cakeBNBLpPrice}`, 'ether'))
        const sushiPrice = allPrices.coingecko.prices.sushi.usd
        const sushiPriceHex = web3.utils.toHex(web3.utils.toWei(`${sushiPrice}`, 'ether'))
        const solPrice = allPrices.coingecko.prices.solana.usd
        const solPriceHex = web3.utils.toHex(web3.utils.toWei(`${solPrice}`, 'ether'))
        const osmoPrice = allPrices.coingecko.prices.osmosis.usd
        const osmoPriceHex = web3.utils.toHex(web3.utils.toWei(`${osmoPrice}`, 'ether'))
        const quickPrice = allPrices.coingecko.prices.quick.usd
        const quickPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickPrice}`, 'ether'))
        const crvPrice = allPrices.eth.ethdata.threePool.crvPrice
        const crvPriceHex = web3.utils.toHex(web3.utils.toWei(`${crvPrice}`, 'ether'))
        const rayPrice = allPrices.coingecko.prices.raydium.usd
        const rayPriceHex = web3.utils.toHex(web3.utils.toWei(`${rayPrice}`, 'ether'))
        const dotPrice = allPrices.coingecko.prices.polkadot.usd
        const dotPriceHex = web3.utils.toHex(web3.utils.toWei(`${dotPrice}`, 'ether'))
        const truPrice = allPrices.coingecko.prices.truefi.usd
        const truPriceHex = web3.utils.toHex(web3.utils.toWei(`${truPrice}`, 'ether'))
        const raydiumRAYSOLPrice = allPrices.solana.raydium.raySol.lp_price
        const raydiumRAYSOLPriceHex =  web3.utils.toHex(web3.utils.toWei(`${raydiumRAYSOLPrice}`, 'ether'))
        const raydiumRAYUSDTPrice = allPrices.solana.raydium.rayUsdt.lp_price
        const raydiumRAYUSDTPriceHex =  web3.utils.toHex(web3.utils.toWei(`${raydiumRAYUSDTPrice}`, 'ether'))
        const uniswapETHUSDTPrice = allPrices.eth.ethdata.ethUsdt.ethUsdtLpTokenPrice.lpTokenPrice
        const uniswapETHUSDTPriceHex =  web3.utils.toHex(web3.utils.toWei(`${uniswapETHUSDTPrice}`, 'ether'))
        const sushiswapETHTRUPrice = allPrices.eth.ethdata.ethTru.truEthLpTokenPrice.lpTokenPrice
        const sushiswapETHTRUPriceHex =  web3.utils.toHex(web3.utils.toWei(`${sushiswapETHTRUPrice}`, 'ether'))
        const quickswapETHQUICKPrice = allPrices.poly.polygonData.quickEth.quickEthLpTokenPrice
        const quickswapETHQUICKPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickswapETHQUICKPrice}`, 'ether'))
        const quickswapETHUSDCPrice = allPrices.poly.polygonData.ethUsdc.ethUsdcLpTokenPrice
        const quickswapETHUSDCPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickswapETHUSDCPrice}`, 'ether'))
        const atomOsmoLpTokenPrice = allPrices.osmosis.atomOsmoLpTokenPrice
        const atomOsmoLpTokenPriceHex = web3.utils.toHex(web3.utils.toWei(`${atomOsmoLpTokenPrice}`, 'ether'))

 /**user readable price -- end **/
        /**Array of all address**/
        let array = [arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB, arSUSHI, arSOL, arOSMO,
            arQUICK, arRAY, arDOT, arTRU, arCRV, arQuickswapETHUSDC, arQuickswapETHQUICK, 
            arRaydiumRAYSOL, arRaydiumRAYUSDT, arUniswapETHUSDT, arSushiswapETHTRU, arOsmosisATOMOSMO ]
        /**Array of all address's price**/
        let price = [bnbPriceHex, cakePriceHex, busdBNBLpPriceHex, cakeBNBLpPriceHex, sushiPriceHex, solPriceHex, osmoPriceHex, quickPriceHex, 
            rayPriceHex, dotPriceHex, truPriceHex, crvPriceHex,
            quickswapETHUSDCPriceHex, quickswapETHQUICKPriceHex, raydiumRAYSOLPriceHex, raydiumRAYUSDTPriceHex, uniswapETHUSDTPriceHex, sushiswapETHTRUPriceHex,
            atomOsmoLpTokenPriceHex ]
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        await web3.eth.accounts.wallet.add(account);
        const myAccount = account.address;
        const gasPrice = await web3.eth.getGasPrice();
        const priceContract = new web3.eth.Contract(oracle_abi, oracle)
         const setBulkPrice =  priceContract.methods.bulkPriceSet(array, price)
         await setBulkPrice.send({
             from: myAccount,
             gasLimit:web3.utils.toHex(300000),
             gasPrice
         })
         .catch((e)=>{throw Error(`unable to set price: ${e.message}`)});
         console.log('Success!')

        return{
            bnbPrice, cakePrice, busdBNBLpPrice, cakeBNBLpPrice, sushiPrice, solPrice, osmoPrice, quickPrice, rayPrice, dotPrice, 
            truPrice, bnbPriceHex, cakePriceHex, busdBNBLpPriceHex, cakeBNBLpPriceHex, sushiPriceHex, solPriceHex, osmoPriceHex,
            quickPriceHex, rayPriceHex, dotPriceHex, truPriceHex, raydiumRAYSOLPriceHex, raydiumRAYUSDTPriceHex, uniswapETHUSDTPriceHex,
            sushiswapETHTRUPriceHex, quickswapETHQUICKPriceHex, quickswapETHUSDCPriceHex, crvPrice, crvPriceHex, sushiswapETHTRUPrice, uniswapETHUSDTPrice,
            raydiumRAYUSDTPrice, raydiumRAYSOLPrice, quickswapETHQUICKPrice, quickswapETHUSDCPrice, atomOsmoLpTokenPrice,
            atomOsmoLpTokenPriceHex,
        }
}
 catch(error){
     console.log(error)
 }
}

exports.getPrices = getPrices