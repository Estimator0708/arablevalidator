const { setup } = require('../../submitter/utils/network');
const testnetAddress = require('../../submitter/config/fujiAddress');
const productionAddress = require('../../submitter/config/avaxAddress');
const web3 = setup();

async function getAddresses() {
  const id = await web3.eth.getChainId();
  if (id == 43114) {
    console.log('Avax Mainnet: no deployment on mainnet yet');
    return productionAddress;
  } else if (id == 43113) {
    // console.log("Avalanche FUJI Testnet")
    return testnetAddress;
  } else {
    console.log('Network is not supported');
    return null;
  }
}

exports.getAddresses = getAddresses;
