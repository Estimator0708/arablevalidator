const Web3 = require('web3');
const { eth_url } = require('../../../../config/config.rpc');
const {
  eth_abi,
  tru_abi,
  priceTru_abi,
  priceEth_abi,
  ethTru_abi,
  ethTruMasterContract_abi,
  truPoolReward_abi,
} = require('../../libs/abis');
const {
  calculateLpTokenPrice,
} = require('../../utils/calculatingLpTokenPrice');
const {
  truRewardAddress,
  ethAddress,
  truAddress,
  priceFeedTruAddress,
  priceFeedEthAddress,
  ethTruAddress,
  ethTruMasterContractAddress,
} = require('../../libs/address');
const web3 = new Web3(eth_url);

async function uniSwap_eth_tru_collector() {
  try {
    const truPoolContract = new web3.eth.Contract(
      truPoolReward_abi,
      truRewardAddress
    );
    const masterContract = new web3.eth.Contract(
      ethTruMasterContract_abi,
      ethTruMasterContractAddress
    );
    const poolContract = new web3.eth.Contract(ethTru_abi, ethTruAddress);
    const ethContract = new web3.eth.Contract(eth_abi, ethAddress);
    const truContract = new web3.eth.Contract(tru_abi, truAddress);
    const priceTruContract = new web3.eth.Contract(
      priceTru_abi,
      priceFeedTruAddress
    );
    const priceEthContract = new web3.eth.Contract(
      priceEth_abi,
      priceFeedEthAddress
    );
    //getting tru.
    const truRewardPerSecondDecimals = await truPoolContract.methods
      .rewardPerSecond()
      .call();
    const truRewardPerSecond = truRewardPerSecondDecimals / 1e18;
    // web3.utils.toHex(web3.utils.toWei(`${parseInt(truRewardPerSecondDecimals * 1e18)/1e18}`, 'ether'))
    //getting sushi allocated to pool
    const poolInfo = await masterContract.methods.poolInfo(8).call();
    const totalPoolAllocation = await masterContract.methods
      .totalAllocPoint()
      .call();
    const sushiPerBlock = await masterContract.methods.sushiPerBlock().call();
    const poolAllocation = poolInfo.allocPoint;
    const poolAllocationPercent = (poolAllocation * 100) / totalPoolAllocation;
    const poolSushiRewardPerBlock =
      (poolAllocationPercent * sushiPerBlock) / 1e18 / 100;
    //live Price of Tru
    const truPriceRoundData = await priceTruContract.methods
      .latestRoundData()
      .call();
    const truPriceRoundAnswer = await truPriceRoundData.answer;
    const truPriceDecimals = await priceTruContract.methods.decimals().call();
    const truPrice =
      (await truPriceRoundAnswer) / Math.pow(10, truPriceDecimals);
    //live Price of ETH
    const ethPriceRoundData = await priceEthContract.methods
      .latestRoundData()
      .call();
    const ethPriceRoundAnswer = await ethPriceRoundData.answer;
    const ethPriceDecimals = await priceEthContract.methods.decimals().call();
    const ethPrice =
      (await ethPriceRoundAnswer) / Math.pow(10, ethPriceDecimals);
    //checking supply of the pool
    const totalSupplyPool = await poolContract.methods.totalSupply().call();
    const totalSupplyDecimals = await poolContract.methods.decimals().call();
    const totalSupply =
      (await totalSupplyPool) / Math.pow(10, totalSupplyDecimals);
    //getting total number of eth and tru
    const ethDecimals = await ethContract.methods.decimals().call();
    const truDecimals = await truContract.methods.decimals().call();
    const reserves = await poolContract.methods.getReserves().call();
    const totalEth = (await reserves[0]) / Math.pow(10, ethDecimals);
    const totalTru = (await reserves[1]) / Math.pow(10, truDecimals);
    //calculating total liquidity
    const lpTokenPrice = await calculateLpTokenPrice(
      totalEth,
      ethPrice,
      totalTru,
      truPrice,
      totalSupply
    );
    //console.log(`Eth price ${ethPrice}, Tru price ${truPrice}, LP token price: ${lpTokenPrice}, ${poolAllocationPercent} sushi per block. Sushi allocated to TRU/ETH ${poolSushiRewardPerBlock}. Tru reward per second: ${truRewardPerSecond}`)

    return {
      poolAllocationPercent,
      poolSushiRewardPerBlock,
      truRewardPerSecond,
      truPrice,
      ethPrice,
      truEthLpTokenPrice: lpTokenPrice,
    };
  } catch (error) {}
}
exports.uniSwap_eth_tru_collector = uniSwap_eth_tru_collector;
