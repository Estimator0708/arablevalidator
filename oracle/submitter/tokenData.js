const Web3 = require('web3');
const { oracle, arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB,
    arSUSHI, arSOL, arOSMO, arQUICK, arCRV, arRAY, arDOT, arTRU  } = require ('./utils/address.js');
const {collect} = require('../collector')
const contract_abi = require ('./contract_abi')
const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc')
//require('dotenv').config()

async function feedingPrice(){
        const allprices = await collect();
        const bnbPrice =  allprices.coingecko.priceJob.binancecoin.usd
        const bnbPriceHex =  web3.utils.toHex(web3.utils.toWei(`${bnbPrice}`, 'ether'))
        const cakePrice = allprices.bsc.pancakeswap.cakeBnb.cakePrice
        const cakePriceHex =  web3.utils.toHex(web3.utils.toWei(`${cakePrice}`, 'ether'))
        const busdBNBLpPrice = allprices.bsc.pancakeswap.busdBnb.busdBnbLpTokenPrice
        const busdBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${busdBNBLpPrice}`, 'ether'))
        const cakeBNBLpPrice = allprices.bsc.pancakeswap.cakeBnb.cakeBnbLpTokenPrice
        const cakeBNBLpPriceHex = web3.utils.toHex(web3.utils.toWei(`${cakeBNBLpPrice}`, 'ether'))
        const sushiPrice = allprices.coingecko.priceJob.sushi.usd
        const sushiPriceHex = web3.utils.toHex(web3.utils.toWei(`${sushiPrice}`, 'ether'))
        const solPrice = allprices.coingecko.priceJob.solana.usd
        const solPriceHex = web3.utils.toHex(web3.utils.toWei(`${solPrice}`, 'ether'))
        const osmoPrice = allprices.coingecko.priceJob.osmosis.usd
        const osmoPriceHex = web3.utils.toHex(web3.utils.toWei(`${osmoPrice}`, 'ether'))
        const quickPrice = allprices.coingecko.priceJob.quick.usd
        const quickPriceHex = web3.utils.toHex(web3.utils.toWei(`${quickPrice}`, 'ether'))
        //ReferenceError: dao is not defined. happening coz of id: curve-dao-token
        //const crvPrice = web3.utils.toHex(web3.utils.toWei(`${allprices.coingecko.priceJob.curve-dao-token.usd}`, 'ether'))
        const rayPrice = allprices.coingecko.priceJob.raydium.usd
        const rayPriceHex = web3.utils.toHex(web3.utils.toWei(`${rayPrice}`, 'ether'))
        const dotPrice = allprices.coingecko.priceJob.polkadot.usd
        const dotPriceHex = web3.utils.toHex(web3.utils.toWei(`${dotPrice}`, 'ether'))
        const truPrice = allprices.coingecko.priceJob.truefi.usd
        const truPriceHex = web3.utils.toHex(web3.utils.toWei(`${truPrice}`, 'ether'))
        //console.log(hexBNBPrice)
        let array = [arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB, arSUSHI, arSOL, arOSMO,
            arQUICK, arRAY, arDOT, arTRU ]
        let price = [bnbPriceHex, cakePriceHex, busdBNBLpPriceHex, cakeBNBLpPriceHex, sushiPriceHex, solPriceHex, osmoPriceHex,
            quickPriceHex, rayPriceHex, dotPriceHex, truPriceHex ]
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        await web3.eth.accounts.wallet.add(account);
        const myAccount = account.address;
        //console.log('Account: ' + myAccount)
        const gasPrice = await web3.eth.getGasPrice();
        const priceContract = new web3.eth.Contract(contract_abi, oracle)
       //console.log(priceContract.methods)
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
//feedingPrice()
exports.feedingPrice = feedingPrice