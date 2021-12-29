const { setup } = require('../config/network');
const {
  arable_vesting,
  root_distributer,
  staking,
  staking_root,
  otc,
} = require('../config/address.js');
const arable_vesting_abi = require('../abis/arable_vesting_abi.json');
const root_distributer_abi = require('../abis/root_distributer_abi');
const staking_abi = require('../abis/staking_abi');
const dstaking_abi = require('../abis/dstaking_abi');
const staking_root_abi = require('../abis/staking_root_abi');
const otc_abi = require('../abis/otc_abi');

const BigNumber = require('bignumber.js');

const web3 = setup();

// - ArableVesting.release - daily - any user
exports.releaseVesting = async function () {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const arableVesting = new web3.eth.Contract(
    arable_vesting_abi,
    arable_vesting
  );

  const releaseVesting = arableVesting.methods.release();
  const txObj = await releaseVesting.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(300000),
    gasPrice,
  });
  console.log('Success releaseVesting!', txObj.transactionHash);
  return txObj.transactionHash;
};

// - RootDistributer.releaseToMemberAll - daily - any user (after release)
exports.rootDistributerReleaseAll = async function () {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const rootDistributer = new web3.eth.Contract(
    root_distributer_abi,
    root_distributer
  );

  const releaseToMemberAll = rootDistributer.methods.releaseToMemberAll();
  const txObj = await releaseToMemberAll.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(300000),
    gasPrice,
  });
  console.log('Success rootDistributerReleaseAll!', txObj.transactionHash);
  return txObj.transactionHash;
};

// - StakingRoot.distributeRewards - daily - any user (after release)
exports.stakingRootDistributeRewards = async function () {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const stakingRootContract = new web3.eth.Contract(
    staking_root_abi,
    staking_root
  );

  const distributeRewards = stakingRootContract.methods.distributeRewards();
  const txObj = await distributeRewards.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(3000000),
    gasPrice,
  });
  console.log('Success stakingRootDistributeRewards!', txObj.transactionHash);
  return txObj.transactionHash;
};

// - DStaking.claimRewardsFromRoot - all the validator - daily - any user (after release)
exports.dstakingReleaseFromStakingRoot = async function (dstaking) {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const dstakingContract = new web3.eth.Contract(dstaking_abi, dstaking);

  const claimRewardsFromRoot = dstakingContract.methods.claimRewardsFromRoot();
  const txObj = await claimRewardsFromRoot.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(300000),
    gasPrice,
  });
  console.log('Success dstakingReleaseFromStakingRoot!', txObj.transactionHash);
  return txObj.transactionHash;
};

// - Staking.claimRewardsFromRoot - daily - any user (after release)
exports.stakingReleaseFromStakingRoot = async function () {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const stakingContract = new web3.eth.Contract(staking_abi, staking);

  const claimRewardsFromRoot = stakingContract.methods.claimRewardsFromRoot();
  const txObj = await claimRewardsFromRoot.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(300000),
    gasPrice,
  });
  console.log('Success stakingReleaseFromStakingRoot!', txObj.transactionHash);
  return txObj.transactionHash;
};

// stakingRoot.dStakingRewardInfos
exports.getValidators = async function () {
  const stakingRootContract = new web3.eth.Contract(
    staking_root_abi,
    staking_root
  );

  const dStakingCount = await stakingRootContract.methods
    .dStakingCount()
    .call();

  // TODO: convert to multicall
  let dstakingInfos = [];
  for (let i = 0; i < dStakingCount; i++) {
    const dStakingInfo = await stakingRootContract.methods
      .dStakingRewardInfos(i)
      .call();
    dstakingInfos.push(dStakingInfo);
  }

  return dstakingInfos;
};

// stakingRoot.setDStakingCreationsAllowed
exports.bulkPermitValidatorCreation = async function (addrs) {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const stakingRootContract = new web3.eth.Contract(
    staking_root_abi,
    staking_root
  );

  const setDStakingCreationsAllowed =
    stakingRootContract.methods.setDStakingCreationsAllowed(addrs, true);
  const txObj = await setDStakingCreationsAllowed.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(3000000),
    gasPrice,
  });
  console.log('Success bulkPermitValidatorCreation!', txObj.transactionHash);
  return txObj.transactionHash;
};

// otc.setUserDeal
exports.setOTCDeal = async function (
  addr,
  acreAmount,
  usdtAmount,
  expiry,
  unlockDate
) {
  const account = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY
  );
  await web3.eth.accounts.wallet.add(account);
  const myAccount = account.address;
  const gasPrice = await web3.eth.getGasPrice();

  const otcContract = new web3.eth.Contract(otc_abi, otc);

  const acreAmountBN = new BigNumber(acreAmount).multipliedBy(
    new BigNumber(Math.pow(10, 18))
  );
  const usdtAmountBN = new BigNumber(usdtAmount).multipliedBy(
    new BigNumber(Math.pow(10, 18))
  );

  const setUserDeal = otcContract.methods.setUserDeal(
    addr,
    acreAmountBN,
    usdtAmountBN,
    expiry,
    unlockDate
  );
  const txObj = await setUserDeal.send({
    from: myAccount,
    gasLimit: web3.utils.toHex(3000000),
    gasPrice,
  });
  console.log('Success setOTCDeal!', txObj.transactionHash);
  return txObj.transactionHash;
};
