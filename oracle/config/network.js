const Web3 = require('web3');
const { fuji_url, avax_url } = require('../../config/config.rpc');

function getNetwork() {
  const args = process.argv.slice(2);
  return args[0] || 'fuji';
}

exports.setup = function () {
  const network = getNetwork();
  if (network == 'avax') {
    return new Web3(avax_url);
  }
  return new Web3(fuji_url);
};

exports.getNetwork = getNetwork;
