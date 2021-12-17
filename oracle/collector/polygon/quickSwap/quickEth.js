const Web3 = require('web3');
const { poly_url } = require('../../../../config/config.rpc');
const {
  polyQuick_abi,
  polyEth_abi,
  polyPriceEth_abi,
  polyPriceQuick_abi,
  polyEthQuickReward_abi,
  stakingLpEthQuick_abi,
} = require('../../libs/abis');
const {
  quickEthpTokenAddress,
  ethPolyAddress,
  quickPolyAddress,
  quickPriceFeedAddress,
  ethPolyPriceFeedAddress,
  quickEthRewardAddress,
} = require('../../libs/address');
const web3 = new Web3(poly_url);

async function quickswap_quick_eth_collector() {
  try {
    const poolContract = new web3.eth.Contract(
      stakingLpEthQuick_abi,
      quickEthpTokenAddress
    );
    const quickContract = new web3.eth.Contract(
      polyQuick_abi,
      quickPolyAddress
    );
    const ethContract = new web3.eth.Contract(polyEth_abi, ethPolyAddress);
    const priceQuickContract = new web3.eth.Contract(
      polyPriceQuick_abi,
      quickPriceFeedAddress
    );
    const priceEthContract = new web3.eth.Contract(
      polyPriceEth_abi,
      ethPolyPriceFeedAddress
    );
    const rewardContract = new web3.eth.Contract(
      polyEthQuickReward_abi,
      quickEthRewardAddress
    );
    //live price of eth
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice =
      (await ethPriceRoundAnswer) / Math.pow(10, ethPriceDecimals);
    //live price of quick
    const quickPriceRoundData = await priceQuickContract.methods
      .latestRoundData()
      .call();
    const quickPriceRoundAnswer = await quickPriceRoundData.answer;
    const quickPriceDecimals = await priceQuickContract.methods
      .decimals()
      .call();
    const quickPrice =
      (await quickPriceRoundAnswer) / Math.pow(10, quickPriceDecimals);
    //total supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);
    //getting total number of eth and quick
    const ethTokenDecimals = await ethContract.methods.decimals().call();
    const quickTokenDecimals = await quickContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalQuickStaked =
      (await reserves[0]) / Math.pow(10, quickTokenDecimals);
    const totalEthStaked = (await reserves[1]) / Math.pow(10, ethTokenDecimals);
    //calculating total liquidty pool
    const totalLiquidity =
      totalEthStaked * ethPrice + totalQuickStaked * quickPrice;
    const lpTokenPrice = totalLiquidity / totalSupply;
    //reward Mechanic
    const rewardRateDecimal = await rewardContract.methods.rewardRate().call();
    const rewardRate = (await rewardRateDecimal) / 1e18;
    //console.log( `Eth price: ${ethPrice}, Quick Price: ${quickPrice}, Lp token Price: ${lpTokenPrice}, Reward rate: ${rewardRate},`)

    return {
      ethPrice,
      quickPrice,
      quickEthLpTokenPrice: lpTokenPrice,
      rewardRate,
    };
  } catch (error) {
    console.log(error);
  }
}

exports.quickswap_quick_eth_collector = quickswap_quick_eth_collector;
