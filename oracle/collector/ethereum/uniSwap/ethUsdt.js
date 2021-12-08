const Web3 = require('web3');
const contract_abi = require('./abis/contract_abi')
const eth_abi = require('./abis/eth_abi')
const usdt_abi = require('./abis/usdt_abi')
const priceUsdt_abi = require ('./abis/priceUsdt_abi')
const priceEth_abi = require('./abis/priceEth_abi')
require('dotenv').config()

//address
const contractAddress= '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852'
const ethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const priceFeedUsdtAddress = '0x3e7d1eab13ad0104d2750b8863b489d65364e32d'
const priceFeedEthAddress = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'

async function uniSwap_weth_usdt_collector () {
    try
        {
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const poolContract = new web3.eth.Contract(contract_abi, contractAddress)
        const ethContract = new web3.eth.Contract(eth_abi, ethAddress)
        const usdtContract = new web3.eth.Contract(usdt_abi, usdtAddress)
        const priceUsdtContract = new web3.eth.Contract(priceUsdt_abi, priceFeedUsdtAddress)
        const priceEthContract = new web3.eth.Contract(priceEth_abi, priceFeedEthAddress)
        //live price of usdt
        const usdtPriceRoundData = await priceUsdtContract.methods.latestRoundData().call()
        const usdtPriceRoundAnswer = await usdtPriceRoundData.answer
        const usdtPriceDecimals = await priceUsdtContract.methods.decimals().call()
        const usdtPrice = await usdtPriceRoundAnswer/Math.pow(10,usdtPriceDecimals)
        console.log('USDT current price: ' + usdtPrice)
        //live price of eth
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
        //getting total number of eth and usdt
        const ethDecimals = await ethContract.methods.decimals().call()
        const usdtDecimals = await usdtContract.methods.decimals().call()
        const reserves = await poolContract.methods.getReserves().call()
        const totalEth = await reserves[0]/Math.pow(10, ethDecimals)
        const totalUsdt = await reserves[1]/Math.pow(10, usdtDecimals)
        //calculating total liquidity
        const totalLiquidity = totalEth*ethPrice + totalUsdt* usdtPrice
        console.log('Total liquidty of the pool:  ' + totalLiquidity)
        const lpTokenPrice = totalLiquidity/totalSupply
        console.log('LP token price: ' + lpTokenPrice)

        return{
            ethPrice,
            usdtPrice,
            lpTokenPrice,
        }
    }
     catch(error){

        console.log(error)
    }
}
exports.uniSwap_weth_usdt_collector = uniSwap_weth_usdt_collector 