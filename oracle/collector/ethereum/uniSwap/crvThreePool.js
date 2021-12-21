const Web3 = require('web3');
const BigNumber = require('bignumber.js');
const { eth_url } = require('../../../../config/config.rpc');
const {
  totalGauageAddress,
  gaugeAddress,
  priceFeedCrvAddress,
} = require('../../libs/address');
const {
  gauageThreePool_abi,
  totalGauage_abi,
  priceCrv_abi,
} = require('../../libs/abis');
const percent = new BigNumber(100);
const web3 = new Web3(eth_url);

async function crv_three_pool() {
  try {
    const totalGauageContract = new web3.eth.Contract(
      totalGauage_abi,
      totalGauageAddress
    );
    const threePoolContract = new web3.eth.Contract(
      gauageThreePool_abi,
      gaugeAddress
    );
    const priceCrvContract = new web3.eth.Contract(
      priceCrv_abi,
      priceFeedCrvAddress
    );
    //live price of eth
    const crvPriceRoundData = await priceCrvContract.methods
      .latestRoundData()
      .call();
    const crvPriceRoundAnswer = await crvPriceRoundData.answer;
    const crvPriceDecimals = await priceCrvContract.methods.decimals().call();
    const crvPrice =
    new BigNumber(await crvPriceRoundAnswer).div(new BigNumber(Math.pow(10, crvPriceDecimals)));
    //getting the gauage weight of 3pool
    const getGauageWeight = new BigNumber(await totalGauageContract.methods
      .get_gauge_weight(gaugeAddress)
      .call());
    const totalGauageWeight = new BigNumber(await totalGauageContract.methods
      .get_total_weight()
      .call());
    const threePoolWeightPercentDecimal = totalGauageWeight.div(getGauageWeight);
    const threePoolWeightPercent = threePoolWeightPercentDecimal.div(new BigNumber(1e19));
    const curveInflation = new BigNumber(await threePoolContract.methods
      .inflation_rate()
      .call());
    const curveMintedPerSecond = curveInflation.div(new BigNumber(1e18));
    const threePoolReward =
      (curveMintedPerSecond.times(threePoolWeightPercent)).div(percent);
    //console.log(`3 pool rate: ${threePoolWeightPercent} %. ${curveMintedPerSecond} CRV is getting minted per second. ${threePoolReward} CRV getting rewarded to a 3 Pool.`)
    return {
      curveMintedPerSecond,
      threePoolReward,
      crvPrice,
    };
  } catch (error) {
    console.log(error);
  }
}
exports.crv_three_pool = crv_three_pool;
