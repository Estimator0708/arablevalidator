const { feedPrices } = require('./feedPrices');
const { feedRewardRates } = require('./feedRewardRates');
const { state } = require('../state');

async function feed(state) {
 // await feedPrices(state);
  await feedRewardRates(state);
}

// TODO: test code just for submission
// feed(state);

exports.feed = feed;
