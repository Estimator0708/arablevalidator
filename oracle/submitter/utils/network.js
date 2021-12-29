const Web3 = require('web3');
const { fuji_url, avax_url } = require('../../../config/config.rpc');

exports.setup = function () {
  const args = process.argv.slice(2);
  console.log('args: ', args);
  if (args[0] == 'avax') {
    return new Web3(avax_url);
  }
  return new Web3(fuji_url);
};
