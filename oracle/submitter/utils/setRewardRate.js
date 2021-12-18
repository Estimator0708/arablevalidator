const { setup } = require('./network');

const { oracle } = require ('../config/address.js');
const { oracle_abi } = require ('../abis/oracle_abi')

const web3 = setup();

require('dotenv').config();



exports.setRewardRate = async function(farmId, rewardToken, dailyRewardRate) {
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    await web3.eth.accounts.wallet.add(account);
    const myAccount = account.address;
    const gasPrice = await web3.eth.getGasPrice();
    const priceContract = new web3.eth.Contract(oracle_abi, oracle)
    
    dailyRewardRate = web3.utils.toHex(web3.utils.toWei(`${dailyRewardRate}`, 'ether'))
    const setFarmReward = priceContract.methods.registerRewardRate(farmId, rewardToken, dailyRewardRate)
    const txObj = await setFarmReward.send({
        from: myAccount,
        gasLimit:web3.utils.toHex(500000),
        gasPrice
    })
    console.log('Success!', txObj.transactionHash)
    return txObj.transactionHash
}
