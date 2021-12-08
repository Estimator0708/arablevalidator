const Web3 = require('web3');
const quickEth_abi = require('./abis/quickEth_abi')
const eth_abi = require('./abis/eth_abi')
const quick_abi = require('./abis/quick_abi')
const priceQuick_abi = require('./abis/priceQuick_abi')
const priceEth_abi = require('./abis/priceEth_abi')
require('dotenv').config()

//contract address
const contractAddress = '0x1bd06b96dd42ada85fdd0795f3b4a79db914add5'
const ethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
const quickAddress = '0x831753dd7087cac61ab5644b308642cc1c33dc13'
const quickPriceFeedAddress = '0xa058689f4bCa95208bba3F265674AE95dED75B6D'
const ethPriceFeedAddress = '0xF9680D99D6C9589e2a93a78A04A279e509205945'

async function quickSwap_quick_eth_collector(){
    try{
        const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const poolContract = new web3.eth.Contract(quickEth_abi,contractAddress)
        const quickContract = new web3.eth.Contract(quick_abi,quickAddress);
        const ethContract = new web3.eth.Contract(eth_abi,ethAddress);
        const priceQuickContract = new web3.eth.Contract(priceQuick_abi,quickPriceFeedAddress);
        const priceEthContract = new web3.eth.Contract(priceEth_abi,ethPriceFeedAddress);
        //const rewardContract = new web3.eth.Contract(reward_abi, rewardAddress)
        //live price of eth
        const ethPriceRoundData = await priceEthContract.methods.latestRoundData().call()
        const ethPriceRoundAnswer = await ethPriceRoundData.answer
        const ethPriceDecimals = await priceEthContract.methods.decimals().call()
        const ethPrice = await ethPriceRoundAnswer/Math.pow(10,ethPriceDecimals)
        console.log('ETH current price: ' + ethPrice)
        //live price of quick
        const quickPriceRoundData = await priceQuickContract.methods.latestRoundData().call()
        const quickPriceRoundAnswer = await quickPriceRoundData.answer
        const quickPriceDecimals = await priceQuickContract.methods.decimals().call()
        const quickPrice = await quickPriceRoundAnswer/Math.pow(10,quickPriceDecimals)
        console.log('Quick current price: ' + quickPrice)
         //total supply of the pool
        const totalSupplyPool = await poolContract.methods.totalSupply().call()
        const totalSupplyDecimals = await poolContract.methods.decimals().call()
        const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
        console.log('Total Supply of the pool: ' + totalSupply)
        //getting total number of eth and quick 
        const ethTokenDecimals = await ethContract.methods.decimals().call()
        const quickTokenDecimals = await quickContract.methods.decimals().call()
        const reserves = await poolContract.methods.getReserves().call()
        const totalQuickStaked = await reserves[0]/Math.pow(10, quickTokenDecimals)
        const totalEthStaked = await reserves[1]/Math.pow(10, ethTokenDecimals)
        console.log(totalQuickStaked, totalEthStaked)
        //calculating total liquidty pool
        const totalLiquidity = totalEthStaked*ethPrice + totalQuickStaked*quickPrice;
        const lpTokenPrice = totalLiquidity/totalSupply
        console.log('LP token price: ' + lpTokenPrice)
        //ca

    }
    catch(error){
        console.log(error)
    }
}
//1952.166507588336
//396371918057470582
//1952166507588335866910 
quickSwap_quick_eth_collector()