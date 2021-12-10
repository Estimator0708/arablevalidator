const Web3 = require('web3');
const quickEth_abi = require('./abis/quickEth_abi')
const eth_abi = require('./abis/eth_abi')
const quick_abi = require('./abis/quick_abi')
const priceQuick_abi = require('./abis/priceQuick_abi')
const priceEth_abi = require('./abis/priceEth_abi')
const rewardPool_abi = require('./abis/rewardQuickEth_abi')

//contract address
const lpTokenAddress = '0x1bd06b96dd42ada85fdd0795f3b4a79db914add5'
const ethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
const quickAddress = '0x831753dd7087cac61ab5644b308642cc1c33dc13'
const quickPriceFeedAddress = '0xa058689f4bCa95208bba3F265674AE95dED75B6D'
const ethPriceFeedAddress = '0xF9680D99D6C9589e2a93a78A04A279e509205945'
const rewardAddress = '0x5BcFcc24Db0A16b1C01BAC1342662eBd104e816c'

async function quickswap_quick_eth_collector(){
    try{
        const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY_POLY}`)
        const poolContract = new web3.eth.Contract(quickEth_abi,lpTokenAddress)
        const quickContract = new web3.eth.Contract(quick_abi,quickAddress);
        const ethContract = new web3.eth.Contract(eth_abi,ethAddress);
        const priceQuickContract = new web3.eth.Contract(priceQuick_abi,quickPriceFeedAddress);
        const priceEthContract = new web3.eth.Contract(priceEth_abi,ethPriceFeedAddress);
        const rewardContract = new web3.eth.Contract(rewardPool_abi, rewardAddress)
        //live price of eth
        const ethPriceRoundData = await priceEthContract.methods.latestRoundData().call()
        const ethPriceRoundAnswer = await ethPriceRoundData.answer
        const ethPriceDecimals = await priceEthContract.methods.decimals().call()
        const ethPrice = await ethPriceRoundAnswer/Math.pow(10,ethPriceDecimals)
        //live price of quick
        const quickPriceRoundData = await priceQuickContract.methods.latestRoundData().call()
        const quickPriceRoundAnswer = await quickPriceRoundData.answer
        const quickPriceDecimals = await priceQuickContract.methods.decimals().call()
        const quickPrice = await quickPriceRoundAnswer/Math.pow(10,quickPriceDecimals)
         //total supply of the pool
        const totalSupplyPool = await poolContract.methods.totalSupply().call()
        const totalSupplyDecimals = await poolContract.methods.decimals().call()
        const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
        //getting total number of eth and quick 
        const ethTokenDecimals = await ethContract.methods.decimals().call()
        const quickTokenDecimals = await quickContract.methods.decimals().call()
        const reserves = await poolContract.methods.getReserves().call()
        const totalQuickStaked = await reserves[0]/Math.pow(10, quickTokenDecimals)
        const totalEthStaked = await reserves[1]/Math.pow(10, ethTokenDecimals)
        //calculating total liquidty pool
        const totalLiquidity = totalEthStaked*ethPrice + totalQuickStaked*quickPrice;
        const lpTokenPrice = totalLiquidity/totalSupply
        //reward Mechanic
        const rewardRateDecimal = await rewardContract.methods.rewardRate().call()
        const rewardRate = await rewardRateDecimal/1e18
        //console.log( `Eth price: ${ethPrice}, Quick Price: ${quickPrice}, Lp token Price: ${lpTokenPrice}, Reward rate: ${rewardRate},`)

        return{
            ethPrice,
            quickPrice,
            quickEthLpTokenPrice: lpTokenPrice,
            rewardRate,
        }

    }
    catch(error){
        console.log(error)
    }
}

exports.quickswap_quick_eth_collector = quickswap_quick_eth_collector