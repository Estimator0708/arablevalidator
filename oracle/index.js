const { collect } = require('./collector');
const { feed } = require('./submitter');
const { setter } = require('./epoch_actions')
const nodeCron = require('node-cron');
require('dotenv').config();

async function main() {
   await priceSetter();
   await epochActions()
}

async function priceSetter(){
    // All scripts will run first second of first minute every hour
  await nodeCron.schedule(' * * * * *', async function () {
    const state = await collect();
    console.log('collection', JSON.stringify(state, null, '\t'));
    await feed(state);
    console.log('feed the oracle successfully!');
  });
}

async function epochActions(){
  //this job will only run once a day as the value is hardcode to a day in farming contract.
  //As of now, this will run at 1st min of 1am everyday
  await nodeCron.schedule(' 1 1 * * *', async function () {
    await setter()
  
  });
}
main();
