const Web3 = require('web3');
const {fuji_url, avax_url} = require('../../config/config.rpc');
const {collect} = require('../../collector');
const { oracle, arBNB, arCAKE, arPancakeswapBUSDBNB, arPancakeswapCAKEBNB,
    arSUSHI, arSOL, arOSMO, arQUICK, arCRV, arRAY, arDOT, arTRU, arOsmosisATOMOSMO, arQuickswapETHUSDC,
    arQuickswapETHQUICK, arRaydiumRAYSOL, arRaydiumRAYUSDT, arUniswapETHUSDT, arCurveDAIUSDCUSDT, arSushiswapETHTRU } = require ('../lib/address.js');
const {oracle_abi} = require ('../lib/contract_abi')
const web3 = new Web3(fuji_url)
require('dotenv').config()


async function cakeBnbFarm(){
    try{
        const allPrices = await collect()
        const cakeAllocatePerBlock = allPrices.bsc.pancakeswap.cakeBnb.poolCakeRewardsPerBlock
        const cakeAllocatePerBlockHex =  web3.utils.toHex(web3.utils.toWei(`${cakeAllocatePerBlock}`, 'ether'))
        const farmId = 5
        const farmIdHex =  web3.utils.toHex(web3.utils.toWei(`${farmId}`, 'ether'))
        console.log(cakeAllocatePerBlockHex)
        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        await web3.eth.accounts.wallet.add(account);
        const myAccount = account.address;
        const gasPrice = await web3.eth.getGasPrice();
        const priceContract = new web3.eth.Contract(oracle_abi, oracle)
        ///console.log(priceContract.methods)
         const setFarmReward =  priceContract.methods.registerRewardRate(farmIdHex, arQUICK, cakeAllocatePerBlockHex)
         await setFarmReward.send({
             from: myAccount,
             gasLimit:web3.utils.toHex(500000),
             gasPrice
         })
         .catch((e)=>{throw Error(`unable to set price: ${e.message}`)});
         console.log('Success!')
    }
    catch(error){
        console.log(error)
    }
}

cakeBnbFarm()