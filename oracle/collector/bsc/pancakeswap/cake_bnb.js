const Web3 = require('web3');
const contract_abi = require('./abis/cakeBNB_abi.js')
const token1_abi = require('./abis/token1_abi.js')
const token2_abi = require('./abis/token2_abi')
const priceFeedBNB_abi = require ('./abis/bnb_abi')
const priceFeedCake_abi = require('./abis/cakePrice_abi')
const mainFarmContract_abi = require ('./abis/mainFarmContract_abi')

//contract address
const mainFarmAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
const contractAddress = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'
const priceFeedBNBAddress = '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE' 
const priceFeedCakeAddress = '0xb6064ed41d4f67e353768aa239ca86f4f73665a1'
const tokenOneAddress = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'
const tokenTwoAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

async function pancakswap_cake_bnb_collector() {
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    const poolContract = new web3.eth.Contract(contract_abi,contractAddress);
    const tokenOneContract = new web3.eth.Contract(token1_abi,tokenOneAddress);
    const tokenTwoContract = new web3.eth.Contract(token2_abi,tokenTwoAddress);
    const priceCakeContract = new web3.eth.Contract(priceFeedCake_abi, priceFeedCakeAddress)
    const mainFarmContract = new web3.eth.Contract(mainFarmContract_abi, mainFarmAddress)
    const priceBNBContract = new web3.eth.Contract(priceFeedBNB_abi, priceFeedBNBAddress)
    //live price Of bnb
    const bnbPriceRoundData = await priceBNBContract.methods.latestRoundData().call()
    const bnbPriceRoundAnswer = await bnbPriceRoundData.answer
    const bnbPriceDecimals = await priceBNBContract.methods.decimals().call()
    const bnbPrice = await bnbPriceRoundAnswer/Math.pow(10,bnbPriceDecimals)
    //live Price of cake 
    const cakePriceRoundData = await priceCakeContract.methods.latestRoundData().call()
    const cakePriceRoundAnswer = await cakePriceRoundData.answer
    const cakePriceDecimals = await priceCakeContract.methods.decimals().call()
    const cakePrice = await cakePriceRoundAnswer/Math.pow(10,cakePriceDecimals)
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call()
    const totalSupplyDecimals = await poolContract.methods.decimals().call()
    const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
    // Getting total number of cake and bnb in pool
    const tokenOneDecimals= await tokenOneContract.methods.decimals().call()
    const tokenTwoDecimals = await tokenTwoContract.methods.decimals().call()
    const reserves = await poolContract.methods.getReserves().call()
    const totalTokenOne = await reserves[0]/Math.pow(10, tokenOneDecimals)
    const totalTokenTwo = await reserves[1]/Math.pow(10, tokenTwoDecimals)
    //calculating total liquidity
    const totalLiquidity = totalTokenOne*cakePrice + totalTokenTwo* bnbPrice
    //console.log('Total liquidty of the pool:  ' + totalLiquidity)
    const lpTokenPrice = totalLiquidity/totalSupply
    //Reward mechanism
    const poolInfo = await mainFarmContract.methods.poolInfo(251).call()
    const poolAllocation = await poolInfo.allocPoint 
    const totalAllocPoint = await mainFarmContract.methods.totalAllocPoint().call()
    const rewardsPerBlock = await mainFarmContract.methods.cakePerBlock().call()
    const cakeEmissionPerBlock = rewardsPerBlock/1e18
    const poolRewardsPerBlock =(poolAllocation/totalAllocPoint)*cakeEmissionPerBlock
    //console.log(`BNB price ${bnbPrice}. Cake price: ${cakePrice}. Cake allocated to Cake/BNB pool ${poolRewardsPerBlock}. LP token Price ${lpTokenPrice}`)

    return {
        bnbPrice,
        cakePrice,
        cakeBnbLpTokenPrice: lpTokenPrice,
        poolCakeRewardsPerBlock: poolRewardsPerBlock,
    }
}

exports.pancakswap_cake_bnb_collector = pancakswap_cake_bnb_collector;
