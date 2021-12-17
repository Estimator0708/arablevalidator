const { collect } = require('./collector');
const { feed } = require('./submitter');
const nodeCron = require('node-cron');
require('dotenv').config();

async function main() {
  // All scripts will run first second of first minute every hour
  await nodeCron.schedule(' * * * * *', async function () {
    const state = await collect();
    console.log('collection', JSON.stringify(state, null, '\t'));
    await feed(state);
    console.log('feed the oracle successfully!');
  });
}

main();
