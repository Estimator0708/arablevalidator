const Web3 = require('web3');
const contract_abi = require('./abis/ethTru_abi')
const tru_abi = require('./abis/tru_abi')
const eth_abi = require('./abis/eth_abi')
const priceTru_abi = require('./abis/priceTru_abi')
const priceEth_abi = require('./abis/priceEth_abi')
const masterContract_abi = require('./abis/masterContract_abi')
const truPoolReward_abi = require('./abis/truPoolReward_abi')

//address
const truRewardAddress = '0xD69BEEcA5Ff117eF87D94B58Ec0E96B5a74A078b'
const masterContractAddress = '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d'
const contractAddress = '0xfCEAAf9792139BF714a694f868A215493461446D'
const ethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const truAddress = '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784'
const priceFeedTruAddress = '0x26929b85fe284eeab939831002e1928183a10fb1'
const priceFeedEthAddress = '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419'

async function uniSwap_eth_tru_collector() {
    try{
        const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`)
        const truPoolContract = new web3.eth.Contract(truPoolReward_abi, truRewardAddress)
        const masterContract = new web3.eth.Contract(masterContract_abi, masterContractAddress)
        const poolContract = new web3.eth.Contract(contract_abi, contractAddress)
        const ethContract = new web3.eth.Contract(eth_abi, ethAddress)
        const truContract = new web3.eth.Contract(tru_abi, truAddress)
        const priceTruContract = new web3.eth.Contract(priceTru_abi, priceFeedTruAddress)
        const priceEthContract = new web3.eth.Contract(priceEth_abi, priceFeedEthAddress)
        //getting tru.
        const truRewardPerSecondDecimals = await truPoolContract.methods.rewardPerSecond().call()
        const truRewardPerSecond  = truRewardPerSecondDecimals/Math.pow(10,18)
        //getting sushi allocated to pool 
        const poolInfo = await masterContract.methods.poolInfo(8).call()
        const totalPoolAllocation = await masterContract.methods.totalAllocPoint().call()
        const sushiPerBlock = await masterContract.methods.sushiPerBlock().call()
        const poolAllocation = poolInfo.allocPoint
        const poolAllocationPercent = (poolAllocation*100)/totalPoolAllocation
        const poolSushiRewardPerBlock = (poolAllocationPercent*sushiPerBlock/1e18)/100
        //live Price of Tru
        const truPriceRoundData = await priceTruContract.methods.latestRoundData().call()
        const truPriceRoundAnswer = await truPriceRoundData.answer
        const truPriceDecimals = await priceTruContract.methods.decimals().call()
        const truPrice = await truPriceRoundAnswer/Math.pow(10,truPriceDecimals)
        //live Price of ETH
        const ethPriceRoundData = await priceEthContract.methods.latestRoundData().call()
        const ethPriceRoundAnswer = await ethPriceRoundData.answer
        const ethPriceDecimals = await priceEthContract.methods.decimals().call()
        const ethPrice = await ethPriceRoundAnswer/Math.pow(10,ethPriceDecimals)
        //checking supply of the pool 
        const totalSupplyPool = await poolContract.methods.totalSupply().call()
        const totalSupplyDecimals = await poolContract.methods.decimals().call()
        const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
        //getting total number of eth and tru
        const ethDecimals = await ethContract.methods.decimals().call()
        const truDecimals = await truContract.methods.decimals().call()
        const reserves = await poolContract.methods.getReserves().call()
        const totalEth = await reserves[0]/Math.pow(10, ethDecimals)
        const totalTru = await reserves[1]/Math.pow(10, truDecimals)
        //calculating total liquidity
        const totalLiquidity = totalEth*ethPrice + totalTru* truPrice
        const lpTokenPrice = totalLiquidity/totalSupply
        //console.log(`Eth price ${ethPrice}, Tru price ${truPrice}, LP token price: ${lpTokenPrice}, ${poolAllocationPercent} sushi per block. Sushi allocated to TRU/ETH ${poolSushiRewardPerBlock}. Tru reward per second: ${truRewardPerSecond}`)

        return{
            poolAllocationPercent,
            poolSushiRewardPerBlock,
            truRewardPerSecond,
            truPrice,
            ethPrice,
            lpTokenPrice,
        }

    }
    catch(error){

    }
}
exports.uniSwap_eth_tru_collector= uniSwap_eth_tru_collector
