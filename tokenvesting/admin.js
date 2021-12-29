const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
  bulkPermitValidatorCreation,
  setOTCDeal,
} = require('./utils/index.js');

const { waitSeconds } = require('../utils/wait');
require('dotenv').config();

async function runTokenVesting() {
  console.log('================ starting token vesting flow ================');
  // TODO: If already claimed for the epoch, not claim again to reduce gas price
  // - ArableVesting.release - daily - any user
  await releaseVesting();
  await waitSeconds(10);
  // - RootDistributer.releaseToMemberAll - daily - any user (after release)
  await rootDistributerReleaseAll();
  await waitSeconds(10);
  // - StakingRoot.distributeRewards - daily - any user (after release)
  await stakingRootDistributeRewards();
  await waitSeconds(10);
  // - Staking.claimRewardsFromRoot - daily - any user (after release)
  await stakingReleaseFromStakingRoot();
  await waitSeconds(10);

  // - DStaking.claimRewardsFromRoot - all the validator - daily - any user (after release)
  const dStakingInfos = await getValidators();
  for (let i = 0; i < dStakingInfos.length; i++) {
    await dstakingReleaseFromStakingRoot(dStakingInfos[i].addr);
    await waitSeconds(5);
  }
  console.log('================ finished token vesting flow ================');
}

// runTokenVesting();

async function bulkPermitValidators() {
  await bulkPermitValidatorCreation([
    '0xe98810c045b720d0e6b56c378e51235de41f36e1',
    '0x5691ccea44fc4a53886ff1b8666c89321f73c49d',
    '0xa4285637d7037ff7edd0301d15027079767712f3',
    '0xc239efef9ba8701dfd7eaa7a2b7543bc1d725219',
    '0x49a3c6ed7836c4cbb1947c476ee944bef378f784',
  ]);
}

// bulkPermitValidators();

async function setOtcDeals() {
  const addrs = [
    '0x63Ae3D5E3ad8d05C676E15d012b8823B6986AD58',
    '0x1eAaEcDefba39A82fe6591bc273359464FD7B646',
    '0x0Cdd33b3B11AD3254F5a8a9E1B64d0F1340DDBa2',
    '0x9F9CAf5f2782d82F0F27d7552f9A01779251EDf4',
    '0x91ef752E6d0c40Ea0b1D542B440ba4CB35B3ac38',
    '0x2122C6F661bD2B7665d42d3FF9bd9282EB5A0a19',
    '0xeFD52a9E454FEB9Ad8edCA588c7a9703d67cdFF7',
    '0xE27A94268f5aa5b70748a38e58293Cd993579a91',
    '0xf5eaC3291438935a380C58dC7A5499A2Fc059fd8',
    '0x0aff6209ecc532bae692e0b4923c379cb2027f07',
    '0xC73a01E10848881F3c4FbBcbd3252151204cf3FB',
    '0xE421DB2597E23BAF92A6caF49660b9335B628030',
    '0xD94dBF2C1fc5b4c9cA277Efc7fF19Da7659d9925',
    '0x5691CCeA44Fc4a53886fF1b8666c89321f73C49D',
    '0x30B9d6D8905bfE688916eb4d5BC2B05eaedacbC0',
    '0xc5620958e8202De1Af3c3CaDF362034f4e02732c',
    '0x49a3c6eD7836C4cBB1947c476ee944BEf378f784',
    '0xa4285637D7037fF7EDd0301d15027079767712F3',
    '0xb251eDB7F7C93C6B43186eCcdaF1518C004A8F7D',
  ];

  const amounts = [
    79192, 33574, 1350, 300, 30000, 3, 101, 200000, 82, 90000, 5000, 400000,
    10000, 1000, 177000, 100, 30000, 100, 300,
  ];

  const currentTimestamp = parseInt(Date.now() / 1000);
  for (let i = 0; i < addrs.length; i++) {
    try {
      await setOTCDeal(
        addrs[i],
        amounts[i],
        100,
        currentTimestamp + 864000, // 10 days expiry
        currentTimestamp + 86400 * 2 // 2 days unlock time
      );
    } catch (err) {
      console.error(err);
    }
  }
}

// setOtcDeals();
