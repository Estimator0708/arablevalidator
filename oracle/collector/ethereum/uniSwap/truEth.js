const Web3 = require('web3');
const contract_abi = require('./abis/ethTru_abi')
const tru_abi = require('./abis/tru_abi')
const eth_abi = require('./abis/eth_abi')
const priceTru_abi = require('./abis/priceTru_abi')
const priceEth_abi = require('./abis/priceEth_abi')
require('dotenv').config()

//address
const contractAddress = '0xfCEAAf9792139BF714a694f868A215493461446D'
const ethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const truAddress = '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784'
const priceFeedTruAddress = '0x26929b85fe284eeab939831002e1928183a10fb1'
const priceFeedEthAddress = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'

async function uniSwap_eth_tru_collector() {
    try{
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const poolContract = new web3.eth.Contract(contract_abi, contractAddress)
        const ethContract = new web3.eth.Contract(eth_abi, ethAddress)
        const truContract = new web3.eth.Contract(tru_abi, truAddress)
        const priceTruContract = new web3.eth.Contract(priceTru_abi, priceFeedTruAddress)
        const priceEthContract = new web3.eth.Contract(priceEth_abi, priceFeedEthAddress)
        //live Price of Tru
        const truPriceRoundData = await priceTruContract.methods.latestRoundData().call()
        const truPriceRoundAnswer = await truPriceRoundData.answer
        const truPriceDecimals = await priceTruContract.methods.decimals().call()
        const truPrice = await truPriceRoundAnswer/Math.pow(10,truPriceDecimals)
        console.log('TRU current price: ' + truPrice)
        //live Price of ETH
        const ethPriceRoundData = await priceEthContract.methods.latestRoundData().call()
        const ethPriceRoundAnswer = await ethPriceRoundData.answer
        const ethPriceDecimals = await priceEthContract.methods.decimals().call()
        const ethPrice = await ethPriceRoundAnswer/Math.pow(10,ethPriceDecimals)
        console.log('ETH current price: ' + ethPrice)
        //checking supply of the pool 
        const totalSupplyPool = await poolContract.methods.totalSupply().call()
        const totalSupplyDecimals = await poolContract.methods.decimals().call()
        const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
        console.log('Total Supply of the pool: ' + totalSupply)
        //getting total number of eth and tru
        const ethDecimals = await ethContract.methods.decimals().call()
        const truDecimals = await truContract.methods.decimals().call()
        const reserves = await poolContract.methods.getReserves().call()
        const totalEth = await reserves[0]/Math.pow(10, ethDecimals)
        const totalTru = await reserves[1]/Math.pow(10, truDecimals)
        //calculating total liquidity
        const totalLiquidity = totalEth*ethPrice + totalTru* truPrice
        console.log('Total liquidty of the pool:  ' + totalLiquidity)
        const lpTokenPrice = totalLiquidity/totalSupply
        console.log('LP token price: ' + lpTokenPrice)

        return{
            truPrice,
            ethPrice,
            lpTokenPrice,
        }
    }
    catch(error){

    }
}

exports.uniSwap_eth_tru_collector= uniSwap_eth_tru_collector