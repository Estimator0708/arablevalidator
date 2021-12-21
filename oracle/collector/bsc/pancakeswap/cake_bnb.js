const Web3 = require('web3');
const BigNumber = require('bignumber.js')
const { bsc_url } = require('../../../../config/config.rpc');
const {
  cake_abi,
  bnb_abi,
  cakePrice_abi,
  bnbPrice_abi,
  cakeBNB_abi,
  mainFarmContract_abi,
} = require('../../libs/abis');
const {
  panCakeFarmAddress,
  cakeBnbAddress,
  cakeAddress,
  bnbAddress,
  priceFeedBNBAddress,
  priceFeedCakeAddress,
} = require('../../libs/address');
const {
  calculateLpTokenPrice,
} = require('../../utils/calculatingLpTokenPrice');
const web3 = new Web3(bsc_url);
async function pancakswap_cake_bnb_collector() {
  try {
    const poolContract = new web3.eth.Contract(cakeBNB_abi, cakeBnbAddress);
    const cakeContract = new web3.eth.Contract(cake_abi, cakeAddress);
    const bnbContract = new web3.eth.Contract(bnb_abi, bnbAddress);
    const priceCakeContract = new web3.eth.Contract(
      cakePrice_abi,
      priceFeedCakeAddress
    );
    const mainFarmContract = new web3.eth.Contract(
      mainFarmContract_abi,
      panCakeFarmAddress
    );
    const priceBNBContract = new web3.eth.Contract(
      bnbPrice_abi,
      priceFeedBNBAddress
    );
    //live price Of bnb
    const bnbPriceRoundData = await priceBNBContract.methods
      .latestRoundData()
      .call();
    const bnbPriceRoundAnswer = await bnbPriceRoundData.answer;
    const bnbPriceDecimals = await priceBNBContract.methods.decimals().call();
    const bnbPrice =
     new BigNumber(await bnbPriceRoundAnswer).div(new BigNumber(Math.pow(10, bnbPriceDecimals)));
    //live Price of cake
    const cakePriceRoundData = await priceCakeContract.methods
      .latestRoundData()
      .call();
    const cakePriceRoundAnswer = await cakePriceRoundData.answer;
    const cakePriceDecimals = await priceCakeContract.methods.decimals().call();
    const cakePrice =
     new BigNumber(await cakePriceRoundAnswer).div(new BigNumber(Math.pow(10, cakePriceDecimals)));
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
     new BigNumber(await totalSupplyPool).div(new BigNumber(Math.pow(10, totalSupplyDecimals)));
    // Getting total number of cake and bnb in pool
    const cakeDecimals = await cakeContract.methods.decimals().call();
    const bnbDecimals = await bnbContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalCake = new BigNumber(await reserves[0]).div(new BigNumber(Math.pow(10, cakeDecimals)));
    const totalBnb = new BigNumber(await reserves[1]).div(new BigNumber(Math.pow(10, bnbDecimals)));
    //calculating total liquidity
    const lpTokenPrice = await calculateLpTokenPrice(
      totalCake,
      cakePrice,
      totalBnb,
      bnbPrice,
      totalSupply
    );
    //Reward mechanism
    const poolInfo = await mainFarmContract.methods.poolInfo(251).call();
    const poolAllocation = await poolInfo.allocPoint;
    const totalAllocPoint = await mainFarmContract.methods
      .totalAllocPoint()
      .call();
    const rewardsPerBlock = await mainFarmContract.methods
      .cakePerBlock()
      .call();
    const cakeEmissionPerBlock = web3.utils.fromWei(rewardsPerBlock,'ether');
    const poolRewardsPerBlock =
      (new BigNumber(poolAllocation).div(new BigNumber(totalAllocPoint))).times(new BigNumber(cakeEmissionPerBlock));
    //console.log(`BNB price ${bnbPrice}. Cake price: ${cakePrice}. Cake allocated to Cake/BNB pool ${poolRewardsPerBlock}.`)

    return {
      bnbPrice,
      cakePrice,
      cakeBnbLpTokenPrice: lpTokenPrice,
      poolCakeRewardsPerBlock: poolRewardsPerBlock,
    };
  } catch (error) {
    console.log(error);
  }
}

exports.pancakswap_cake_bnb_collector = pancakswap_cake_bnb_collector;
