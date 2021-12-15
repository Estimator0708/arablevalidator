const Web3 = require('web3');
const {fuji_url, avax_url} = require('../../config/config.rpc');
const { oracle, arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB,
    arSUSHI, arSOL, arOSMO, arQUICK, arCRV, arRAY, arDOT, arTRU, arOsmosisATOMOSMO, arQuickswapETHUSDC,
    arQuickswapETHQUICK, arRaydiumRAYSOL, arRaydiumRAYUSDT, arUniswapETHUSDT, arCurveDAIUSDCUSDT, arSushiswapETHTRU } = require ('../lib/address.js');
const contract_abi = require ('../lib/contract_abi')
const {getPrices} = require('../utils/getPrice')
const web3 = new Web3(fuji_url); //use avax_url for mainnet

async function feedingPrice(tokenPrices){
    try { 
        const getPrice = await getPrices(tokenPrices)
        const decimalMultiplier = 1e18;
        /**user readable price -- start **/
        const bnbPrice = getPrice.bnbPrice * decimalMultiplier ; 
        const cakePrice= getPrice.cakePrice * decimalMultiplier; 
        const sushiPrice = getPrice.sushiPrice * decimalMultiplier;
        const solPrice = getPrice.solPrice * decimalMultiplier;
        const osmoPrice = getPrice.osmoPrice * decimalMultiplier;
        const quickPrice = getPrice.quickPrice * decimalMultiplier;
        const rayPrice = getPrice.rayPrice * decimalMultiplier;
        const dotPrice = getPrice.dotPrice * decimalMultiplier;
        const truPrice = getPrice.truPrice * decimalMultiplier;
        const crvPrice = getPrice.crvPrice * decimalMultiplier;
        const busdBNBLpPrice = getPrice.busdBNBLpPrice * decimalMultiplier;
        const cakeBNBLpPrice = getPrice.cakeBNBLpPrice * decimalMultiplier;
        const raydiumRAYSOLPrice = getPrice.raydiumRAYSOLPrice * decimalMultiplier;
        const raydiumRAYUSDTPrice = getPrice.raydiumRAYUSDTPrice * decimalMultiplier;
        const uniswapETHUSDTPrice = getPrice.uniswapETHUSDTPrice * decimalMultiplier;
        const sushiswapETHTRUPrice = getPrice.sushiswapETHTRUPrice * decimalMultiplier;
        const quickswapETHQUICKPrice = getPrice.quickswapETHQUICKPrice * decimalMultiplier;
        const quickswapETHUSDCPrice = getPrice.quickswapETHUSDCPrice * decimalMultiplier;
        const atomOsmoLpTokenPrice = getPrice.atomOsmoLpTokenPrice * decimalMultiplier; 
        /**user readable price -- end **/
        /**Array of all address**/
        let array = [arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB, arSUSHI, arSOL, arOSMO,
            arQUICK, arRAY, arDOT, arTRU, arCRV, arQuickswapETHUSDC, arQuickswapETHQUICK, 
            arRaydiumRAYSOL, arRaydiumRAYUSDT, arUniswapETHUSDT, arSushiswapETHTRU, arOsmosisATOMOSMO ]
        /**Array of all address's price**/
        let price = [getPrice.bnbPriceHex, getPrice.cakePriceHex, getPrice.busdBNBLpPriceHex, getPrice.cakeBNBLpPriceHex,
            getPrice.sushiPriceHex, getPrice.solPriceHex, getPrice.osmoPriceHex, getPrice.quickPriceHex, 
            getPrice.rayPriceHex, getPrice.dotPriceHex, getPrice.truPriceHex, getPrice.crvPriceHex,
            getPrice.quickswapETHUSDCPriceHex, getPrice.quickswapETHQUICKPriceHex, getPrice.raydiumRAYSOLPriceHex,
            getPrice.raydiumRAYUSDTPriceHex, getPrice.uniswapETHUSDTPriceHex, getPrice.sushiswapETHTRUPriceHex,
            getPrice.atomOsmoLpTokenPriceHex ]
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        await web3.eth.accounts.wallet.add(account);
        const myAccount = account.address;
        const gasPrice = await web3.eth.getGasPrice();
        const priceContract = new web3.eth.Contract(contract_abi, oracle)
         const setBulkPrice =  priceContract.methods.bulkPriceSet(array, price)
         await setBulkPrice.send({
             from: myAccount,
             gasLimit:web3.utils.toHex(300000),
             gasPrice
         })
         .catch((e)=>{throw Error(`unable to set price: ${e.message}`)});
         console.log('Success!')

        return{
        bnbPrice, cakePrice, busdBNBLpPrice, cakeBNBLpPrice, sushiPrice, solPrice, osmoPrice,
        quickPrice, rayPrice, dotPrice, truPrice, crvPrice, raydiumRAYSOLPrice, raydiumRAYUSDTPrice,
        uniswapETHUSDTPrice, sushiswapETHTRUPrice, quickswapETHQUICKPrice, quickswapETHUSDCPrice, atomOsmoLpTokenPrice
        }
    }
    catch(error){
             console.log(error)
    }
}
exports.feedingPrice = feedingPrice