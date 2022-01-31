const {
  releaseVesting,
  rootDistributerReleaseAll,
  dstakingReleaseFromStakingRoot,
  stakingReleaseFromStakingRoot,
  stakingRootDistributeRewards,
  getValidators,
  submitStatus,
} = require('./utils/index.js');

const nodeCron = require('node-cron');
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
  // await waitSeconds(10);

  // - DStaking.claimRewardsFromRoot - all the validator - daily - any user (after release)
  // if (process.env.VALIDATOR_ADDRESS) {
  //   await dstakingReleaseFromStakingRoot(process.env.VALIDATOR_ADDRESS);
  //   await waitSeconds(5);
  // } else {
  //   const dStakingInfos = await getValidators();
  //   for (let i = 0; i < dStakingInfos.length; i++) {
  //     await dstakingReleaseFromStakingRoot(dStakingInfos[i].addr);
  //     await waitSeconds(5);
  //   }
  // }
  console.log('================ finished token vesting flow ================');
}

async function main() {
  // this job will only run once a day as the value is hardcode to a day in farming contract.
  // As of now, this will run at 1st min of 1am everyday

  if (process.env.VALIDATOR_ADDRESS) {
    nodeCron.schedule('10 1 * * *', async function () {
      if (process.env.VALIDATOR_ADDRESS) {
        console.log('====submit validator active status===');
        await submitStatus(process.env.VALIDATOR_ADDRESS);
      }
    });
  } else {
    nodeCron.schedule('1 1 * * *', async function () {
      await runTokenVesting();
    });
  }
}

main();
