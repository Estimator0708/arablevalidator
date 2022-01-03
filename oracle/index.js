const { collect } = require('./collector');
const { feed } = require('./submitter');
const { executeEpoch } = require('./epoch_actions');
const nodeCron = require('node-cron');
require('dotenv').config();
//const {getNetwork} = require('./test2');
const {getNetwork, setup} = require('./test')
//const { test1 } = require('./submitter/utils/network');

async function main() {
  console.log('Input 1 for Avax Mainnet & 2 for Fuji testnet.')
  setup();
  await runDataFeedActions();
  //await runEpochActions();
}

async function runDataFeedActions() {
  // All scripts will run first second of first minute every hour
  await nodeCron.schedule('51 * * * *', async function () {
    const state = await collect();
    console.log('collection', JSON.stringify(state, null, '\t'));
    await feed(state);
    console.log('feed the oracle successfully!');
  });
}

async function runEpochActions() {
  //this job will only run once a day as the value is hardcode to a day in farming contract.
  //As of now, this will run at 1st min of 1am everyday
  await nodeCron.schedule(' 1 1 * * *', async function () {
    await executeEpoch();
  });
}




main();
