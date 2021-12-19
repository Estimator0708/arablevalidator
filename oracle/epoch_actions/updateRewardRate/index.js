const { waitSeconds } = require('../../submitter/utils/wait');
const addresses= require ('../../submitter/config/address.js');
const {setRewardRateSum} = require('../utils/updateRewardRateSum');

function rewardAddresses() {
    return [
            {
                farmId: 0,
                rewardTokenSymbols: ["arOSMO"],
            },
            {
                farmId: 1,
                rewardTokenSymbols: ["arOSMO"]
            },
            {
                farmId: 2,
                rewardTokenSymbols: ["arCAKE"]
            },
            {
                farmId: 3,
                rewardTokenSymbols: ["arCAKE"]
            },
            {
                farmId: 4,
                rewardTokenSymbols: ["arQUICK"]
            },
            {
                farmId: 5,
                rewardTokenSymbols: ["arQUICK"]
            },
            {
                farmId: 6,
                rewardTokenSymbols: ["arRAY"]
            },
            {
                farmId: 7,
                rewardTokenSymbols: ["arRAY"]
            },
            {
                farmId: 9,
                rewardTokenSymbols: ["arCRV"]
            },
            {
                farmId: 10,
                rewardTokenSymbols: ["arSUSHI"]
            },
            {
                farmId: 10,
                rewardTokenSymbols: ["arTRU"]
            },
            {
                farmId: 11,
                rewardTokenSymbols: ["arUSD"]
            },
        ];
}

async function setRewardRate(){
        try{ 
            const setRewards = rewardAddresses();
            for(let i=0; i<setRewards.length; i++){
                const reward = setRewards[i];
                console.log(`setting reward for farmId = ${reward.farmId}`);
                let addrs = reward.rewardTokenSymbols.map((symbol) => addresses[symbol]);
                await setRewardRateSum( reward.farmId, addrs.toString());
                await waitSeconds(3);
            }
        }
        catch(error){
            console.log(error);
        }
}
exports.setRewardRate = setRewardRate;