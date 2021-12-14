const Web3 = require('web3');
const { oracle, arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB,
    arSUSHI, arSOL, arOSMO, arQUICK, arCRV, arRAY, arDOT, arTRU  } = require ('../lib/address.js');
const contract_abi = require ('../lib/contract_abi')
const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc')
const {getPrices} = require('../utils/getPrice')

async function feedingPrice(tokenPrices){
    try { 
        const getPrice = await getPrices(tokenPrices)
        /**user readable price -- start **/
        bnbPrice = getPrice.bnbPrice; 
        cakePrice= getPrice.cakePrice; 
        busdBNBLpPrice = getPrice.busdBNBLpPrice;
        cakeBNBLpPrice = getPrice.cakeBNBLpPrice;
        sushiPrice = getPrice.sushiPrice;
        solPrice = getPrice.solPrice;
        osmoPrice = getPrice.osmoPrice;
        quickPrice = getPrice.quickPrice;
        rayPrice = getPrice.rayPrice;
        dotPrice = getPrice.dotPrice;
        truPrice = getPrice.truPrice;
        /**user readable price -- end **/
        /**Array of all address**/
        let array = [arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB, arSUSHI, arSOL, arOSMO,
            arQUICK, arRAY, arDOT, arTRU ]
        /**Array of all address's price**/
        let price = [getPrice.bnbPriceHex, getPrice.cakePriceHex, getPrice.busdBNBLpPriceHex, getPrice.cakeBNBLpPriceHex, getPrice.sushiPriceHex, getPrice.solPriceHex, getPrice.osmoPriceHex,
            getPrice.quickPriceHex, getPrice.rayPriceHex, getPrice.dotPriceHex, getPrice.truPriceHex ]
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
            quickPrice, rayPrice, dotPrice, truPrice,
         }
    }
    catch(error){
             console.log(error)
    }
}
exports.feedingPrice = feedingPrice