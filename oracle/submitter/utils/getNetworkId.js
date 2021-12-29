const { setup } = require('./network');
const testnetAddress = require('../config/fujiAddress');
const productionAddress = require('../config/mainnetAdress');
const web3 = setup();

async function getNetwork() {
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

exports.getNetwork = getNetwork;
