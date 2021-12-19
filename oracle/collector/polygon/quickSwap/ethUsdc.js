const Web3 = require('web3');
const { poly_url } = require('../../../../config/config.rpc');
const {polyUsdc_abi, polyEth_abi, polyPriceEth_abi, polyPriceUsdc_abi, polyEthUsdcReward_abi, stakingLpEthUsdc_abi } = require('../../libs/abis');
const {ethUsdcPolyStakingLPAddress, usdcPolyAddress, ethPolyAddress, usdcPolyPriceFeedAddress, ethPolyPriceFeedAddress, polyRewardAddress} = require('../../libs/address');
const web3 = new Web3(`https://polygon-mainnet.infura.io/v3/${process.env.infura_api_key}`)
async function quickswap_eth_usdc_collector(){
  try { 
    const poolContract = new web3.eth.Contract(stakingLpEthUsdc_abi,ethUsdcPolyStakingLPAddress)
    const usdcContract = new web3.eth.Contract(polyUsdc_abi,usdcPolyAddress);
    const ethContract = new web3.eth.Contract(polyEth_abi,ethPolyAddress);
    const priceUsdcContract = new web3.eth.Contract(polyPriceUsdc_abi,usdcPolyPriceFeedAddress);
    const priceEthContract = new web3.eth.Contract(polyPriceEth_abi,ethPolyPriceFeedAddress);
    const rewardContract = new web3.eth.Contract(polyEthUsdcReward_abi, polyRewardAddress)
    //live price of eth
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice =
      (await ethPriceRoundAnswer) / Math.pow(10, ethPriceDecimals);
    // //live price of usdc
    const usdcPriceRoundData = await priceUsdcContract.methods
      .latestRoundData()
      .call();
    const usdcPriceRoundAnswer = await usdcPriceRoundData.answer;
    const usdcPriceDecimals = await priceUsdcContract.methods.decimals().call();
    const usdcPrice =
      (await usdcPriceRoundAnswer) / Math.pow(10, usdcPriceDecimals);
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);
    //getting total number of eth and usdc in pool
    const usdcTokenDecimls = await usdcContract.methods.decimals().call();
    const ethTokenDecimals = await ethContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalUsdcStaked =
      (await reserves[0]) / Math.pow(10, usdcTokenDecimls);
    const totalEthStaked = (await reserves[1]) / Math.pow(10, ethTokenDecimals);
    //calculating total liquidty pool
    const totalLiquidity =
      totalEthStaked * ethPrice + totalUsdcStaked * usdcPrice;
    const lpTokenPrice = totalLiquidity / totalSupply;
    //reward Mechanic
    const rewardRateDecimal = await rewardContract.methods.rewardRate().call()
    const rewardRate = await rewardRateDecimal/1e18
   //console.log( `Lp token Price: ${lpTokenPrice}, Reward rate: ${rewardRate},`)

    return {
      ethPrice,
      usdcPrice,
      ethUsdcLpTokenPrice: lpTokenPrice,
      rewardRate,
    };
  } catch (error) {
    console.log(error);
  }
}

exports.quickswap_eth_usdc_collector = quickswap_eth_usdc_collector;
