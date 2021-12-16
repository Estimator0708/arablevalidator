const {getPrices} = require('../utils/setBulkPrice')

async function feedingPrice(tokenPrices){
    try { 
        const getPrice = await getPrices(tokenPrices)
        const decimalMultiplier = 1e18;
        /**user readable price -- start **/
        const bnbPrice = getPrice.bnbPrice * decimalMultiplier; 
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