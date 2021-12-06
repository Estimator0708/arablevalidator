const Web3 = require('web3');
const contract_abi = require('./abis/busdBNB_abi')
const token1_abi = require('./abis/busd_abi')
const token2_abi = require('./abis/token2_abi')
const priceFeedBNB_abi = require ('./abis/bnb_abi')
const priceFeedBusd_abi = require('./abis/busdPrice_abi')
const mainFarmContract_abi = require ('./abis/mainFarmContract_abi')

//contract address
const mainFarmAddress = '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
const contractAddress = '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'
const priceFeedBNBAddress = '0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE' 
const priceFeedBusdAddress = '0xcbb98864ef56e9042e7d2efef76141f15731b82f'
const tokenOneAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'
const tokenTwoAddress = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'

async function pancakswap_busd_bnb_collector() {
    const web3 = new Web3('https://bsc-dataseed1.binance.org:443');
    const poolContract = new web3.eth.Contract(contract_abi,contractAddress);
    const tokenOneContract = new web3.eth.Contract(token1_abi,tokenOneAddress);
    const tokenTwoContract = new web3.eth.Contract(token2_abi,tokenTwoAddress);
    const priceBusdContract = new web3.eth.Contract(priceFeedBusd_abi, priceFeedBusdAddress)
    const mainFarmContract = new web3.eth.Contract(mainFarmContract_abi, mainFarmAddress)
    const priceBNBContract = new web3.eth.Contract(priceFeedBNB_abi, priceFeedBNBAddress)
    //live price Of bnb
    const bnbPriceRoundData = await priceBNBContract.methods.latestRoundData().call()
    const bnbPriceRoundAnswer = await bnbPriceRoundData.answer
    const bnbPriceDecimals = await priceBNBContract.methods.decimals().call()
    const bnbPrice = await bnbPriceRoundAnswer/Math.pow(10,bnbPriceDecimals)
    console.log('BNB current price: ' + bnbPrice)
    //live Price of busd 
    const busdPriceRoundData = await priceBusdContract.methods.latestRoundData().call()
    const busdPriceRoundAnswer = await busdPriceRoundData.answer
    const busdPriceDecimals = await priceBusdContract.methods.decimals().call()
    const busdPrice = await busdPriceRoundAnswer/Math.pow(10,busdPriceDecimals)
    console.log('Busd current price: ' + busdPrice)
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call()
    const totalSupplyDecimals = await poolContract.methods.decimals().call()
    const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
    console.log('Total Supply of the pool: ' + totalSupply)
    // Getting total number of busd and bnb in pool
    const tokenOneDecimals= await tokenOneContract.methods.decimals().call()
    const tokenTwoDecimals = await tokenTwoContract.methods.decimals().call()
    const reserves = await poolContract.methods.getReserves().call()
    const totalTokenOne = await reserves[0]/Math.pow(10, tokenOneDecimals)
    const totalTokenTwo = await reserves[1]/Math.pow(10, tokenTwoDecimals)
    //calculating total liquidity
    const totalLiquidity = totalTokenOne*bnbPrice + totalTokenTwo* busdPrice
    console.log('Total liquidty of the pool:  ' + totalLiquidity)
    const lpTokenPrice = totalLiquidity/totalSupply
    console.log('LP token price: ' + lpTokenPrice)
    //Reward mechanism
    const poolInfo = await mainFarmContract.methods.poolInfo(252).call()
    const poolAllocation = await poolInfo.allocPoint 
    const totalAllocPoint = await mainFarmContract.methods.totalAllocPoint().call()
    const rewardsPerBlock = await mainFarmContract.methods.cakePerBlock().call()
    const cakeEmissionPerBlock = rewardsPerBlock/1e18
    const poolRewardsPerBlock =(poolAllocation/totalAllocPoint)*cakeEmissionPerBlock
    console.log('Total allocation: ' + totalAllocPoint + '. Busd/BNB pool allocation: '
        + poolAllocation + '. Total Cake emission per block: ' + cakeEmissionPerBlock + '. Cake allocated to busd/BNB pool: ' + poolRewardsPerBlock)

    return {
        bnbPrice,
        busdPrice,
        busdBnbLpTokenPrice: lpTokenPrice,
        poolCakeRewardsPerBlock: poolRewardsPerBlock,
    }
}

exports.pancakswap_busd_bnb_collector = pancakswap_busd_bnb_collector;
