const { updateRewardRateSums } = require('./updateRewardRate');

exports.executeEpoch = async function () {
  await updateRewardRateSums();
};
