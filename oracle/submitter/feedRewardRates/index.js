const addresses = require ('../config/address.js');
const { waitSeconds } = require('../utils/wait');
const { setRewardRate } = require('../utils/setRewardRate');
const { setBulkRewardRate } = require('../utils/setBulkRewardRate');
const { farms } = require('../config')

function convertToFormalRewardRates(state) {
    return [
            {
                farmId: 0,
                rewardTokenSymbols: ["arOSMO"],
                rewardRates: [state.osmosis.osmoStakingRewardsApr]
            },
            {
                farmId: 1,
                rewardTokenSymbols: ["arOSMO"],
                rewardRates: [state.osmosis.atomOsmoLpTokenReward14DaysBondedApr]
            },
            {
                farmId: 2,
                rewardTokenSymbols: ["arCAKE"],
                rewardRates: [state.bsc.pancakeswap.cakeBnb.poolCakeRewardsPerBlock]
            },
            {
                farmId: 3,
                rewardTokenSymbols: ["arCAKE"],
                rewardRates: [state.bsc.pancakeswap.busdBnb.poolCakeRewardsPerBlock]
            },
            {
                farmId: 4,
                rewardTokenSymbols: ["arQUICK"],
                rewardRates: [state.poly.polygonData.ethUsdc.rewardRate]
            },
            {
                farmId: 5,
                rewardTokenSymbols: ["arQUICK"],
                rewardRates: [state.poly.polygonData.quickEth.rewardRate]
            },
            {
                farmId: 6,
                rewardTokenSymbols: ["arRAY"],
                rewardRates: [state.solana.raydium.raySol.apy] // TODO: this is incorrect value fix after Chris' work
            },
            {
                farmId: 7,
                rewardTokenSymbols: ["arRAY"],
                rewardRates: [state.solana.raydium.rayUsdt.apy] // TODO: this is incorrect value fix after Chris' work
            },
            {
                farmId: 9,
                rewardTokenSymbols: ["arCRV"],
                rewardRates: [state.eth.ethdata.threePool.threePoolReward] // TODO: make it correct
            },
            {
                farmId: 10,
                rewardTokenSymbols: ["arSUSHI", "arTRU"],
                rewardRates: [
                    state.eth.ethdata.ethTru.poolSushiRewardPerBlock,
                    state.eth.ethdata.ethTru.truRewardPerSecond,
                ] // TODO: make it correct
            },
            {
                farmId: 11,
                rewardTokenSymbols: ["arUSD"],
                rewardRates: [state.eth.ethdata.usdtAave.currentLendingRate]
			},
        ];
}

async function feedRewardRates(state){
    try {
        // const state = await collect()
        // const cakeAllocatePerBlock = state.bsc.pancakeswap.cakeBnb.poolCakeRewardsPerBlock
        // const cakeAllocatePerDay = 1;
        // const farmId = 3
        // await setRewardRate(farmId, arCAKE, cakeAllocatePerDay);
        // await setBulkRewardRate(farmId, [arCAKE], [cakeAllocatePerDay]);

        const farmRewardRates = convertToFormalRewardRates(state);
        for (let i = 0; i < farmRewardRates.length; i ++) {
            const farm = farmRewardRates[i];
            console.log(`submitting farm reward information for farmId=${farm.farmId}`);
            const addrs = farm.rewardTokenSymbols.map(symbol => addresses[symbol]);
            await setBulkRewardRate(farm.farmId, addrs, farm.rewardRates);
            await waitSeconds(3);
        }
    }
    catch(error){
        console.log(error)
    }
}

exports.feedRewardRates = feedRewardRates