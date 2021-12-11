const Web3 = require('web3');
const stakingLP_abi = require('./abis/stakingLpEthUsdc_abi')
const usdc_abi = require('./abis/usdc_abi')
const eth_abi = require('./abis/eth_abi')
const priceEth_abi = require('./abis/priceEth_abi')
const priceUsdc_abi = require ('./abis/priceUsdc_abi')
const reward_abi = require('./abis/reward_abi')

//address
const stakingLPAddress = '0x853Ee4b2A13f8a742d64C8F088bE7bA2131f670d'
const usdcAddress = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
const ethAddress = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
const usdcPriceFeedAddress = '0xfE4A8cc5b5B2366C1B58Bea3858e81843581b2F7'
const ethPriceFeedAddress = '0xF9680D99D6C9589e2a93a78A04A279e509205945'
const rewardAddress = '0xbB703E95348424FF9e94fbE4FB524f6d280331B8'

async function quickswap_eth_usdc_collector(){
  try { 
    const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${process.env.INFURA_API_KEY_POLY}`)
    const poolContract = new web3.eth.Contract(stakingLP_abi,stakingLPAddress)
    const usdcContract = new web3.eth.Contract(usdc_abi,usdcAddress);
    const ethContract = new web3.eth.Contract(eth_abi,ethAddress);
    const priceUsdcContract = new web3.eth.Contract(priceUsdc_abi,usdcPriceFeedAddress);
    const priceEthContract = new web3.eth.Contract(priceEth_abi,ethPriceFeedAddress);
    const rewardContract = new web3.eth.Contract(reward_abi, rewardAddress)
    //live price of eth
    const ethPriceRoundData = await priceEthContract.methods.latestRoundData().call()
    const ethPriceRoundAnswer = await ethPriceRoundData.answer
    const ethPriceDecimals = await priceEthContract.methods.decimals().call()
    const ethPrice = await ethPriceRoundAnswer/Math.pow(10,ethPriceDecimals)
    // //live price of usdc
    const usdcPriceRoundData = await priceUsdcContract.methods.latestRoundData().call()
    const usdcPriceRoundAnswer = await usdcPriceRoundData.answer
    const usdcPriceDecimals = await priceUsdcContract.methods.decimals().call()
    const usdcPrice = await usdcPriceRoundAnswer/Math.pow(10, usdcPriceDecimals)
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call()
    const totalSupplyDecimals = await poolContract.methods.decimals().call()
    const totalSupply = await totalSupplyPool/Math.pow(10,totalSupplyDecimals)
    //getting total number of eth and usdc in pool
    const usdcTokenDecimls = await usdcContract.methods.decimals().call()
    const ethTokenDecimals = await ethContract.methods.decimals().call()
    const reserves = await poolContract.methods.getReserves().call()
    const totalUsdcStaked = await reserves[0]/Math.pow(10,usdcTokenDecimls)
    const totalEthStaked = await reserves[1]/Math.pow(10, ethTokenDecimals)
    //calculating total liquidty pool
    const totalLiquidity = totalEthStaked*ethPrice + totalUsdcStaked*usdcPrice;
    const lpTokenPrice = totalLiquidity/totalSupply
    //reward Mechanic
    const rewardRateDecimal = await rewardContract.methods.rewardRate().call()
    const rewardRate = await rewardRateDecimal/1e18
   // console.log( `Lp token Price: ${lpTokenPrice}, Reward rate: ${rewardRate},`)

    return {
        ethPrice,
        usdcPrice,
        ethUsdcLpTokenPrice: lpTokenPrice,
        rewardRate,
    }

    }
    catch (error){
        console.log(error)
    }
}

exports.quickswap_eth_usdc_collector = quickswap_eth_usdc_collector