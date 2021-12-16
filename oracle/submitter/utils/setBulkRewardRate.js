const { setup } = require('./network');

const { oracle } = require ('../config/address.js');
const { oracle_abi } = require ('../abis/oracle_abi')

const web3 = setup();

require('dotenv').config();

// function bulkRegisterRewardRate(
//     uint256 farmId_, 
//     address[] calldata rewardTokens_, 
//     uint256[] calldata dailyRewardRates_) external onlyAllowedProvider

exports.setBulkRewardRate = async function(farmId, rewardTokens, dailyRewardRates) {
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
    await web3.eth.accounts.wallet.add(account);
    const myAccount = account.address;
    const gasPrice = await web3.eth.getGasPrice();
    const priceContract = new web3.eth.Contract(oracle_abi, oracle)
    
    // cut decimals if too low
    dailyRewardRates = dailyRewardRates.map(rate => web3.utils.toHex(web3.utils.toWei(`${parseInt(rate * 1e18)/1e18}`, 'ether')))
    const setFarmReward = priceContract.methods.bulkRegisterRewardRate(farmId, rewardTokens, dailyRewardRates)
    const txObj = await setFarmReward.send({
        from: myAccount,
        gasLimit: web3.utils.toHex(500000),
        gasPrice
    })
    console.log('Success!', txObj.transactionHash)
    return txObj.transactionHash
}

