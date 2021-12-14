const axios = require('axios')
const dayjs = require('dayjs')
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const CoinGecko = require('coingecko-api')
const coinGeckoApi = new CoinGecko();

async function collect_osmosis() {

    // TODO: get price from script output https://github.com/ArableProtocol/arablevalidator/issues/4
    let priceData = (await coinGeckoApi.simple.price({
        ids: ['cosmos', 'osmosis'],
        vs_currencies: ['usd'],
    })).data

    const osmoInfo = await coinGeckoApi.coins.fetch('osmosis',{})
    // TODO: get total supply from some on chain API call, I can't find it
    // I'm not sure what the correct supply to use in the staking APR calculation
    const osmoSupply = osmoInfo.data.market_data.circulating_supply
    //const osmoSupply = osmoInfo.data.market_data.total_supply
    
    // compute ATOM-OSMO LP token price
    const poolId = 1 //ATOM-OSMO
    const poolData = await axios.get('https://lcd-osmosis.keplr.app/osmosis/gamm/v1beta1/pools/' + poolId).then(res => res.data.pool)

    const atom = poolData.poolAssets[0]
    const osmo = poolData.poolAssets[1]

    if (atom.weight != osmo.weight) {
        throw `ATOM ${atom.weight} and OSMO ${osmo.weight} weight do not match!`
    }
    const totalSupply = atom.weight/10.0**6
    
    const totalLpAtom = atom.token.amount/10.0**6
    const atomPrice = priceData.cosmos.usd
    const totalLpOsmo = osmo.token.amount/10.0**6
    const osmoPrice = priceData.osmosis.usd
    const poolTotalValueLocked = totalLpAtom * atomPrice + totalLpOsmo * osmoPrice

    const lpTokenPrice = poolTotalValueLocked/totalSupply

    // compute LP token reward APY for 14 day bondage
    const distrInfo = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/distr_info').then(res => res.data.distr_info)
    const totalWeight = distrInfo.total_weight
    
    const incentivizedPools = await axios.get('https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/incentivized_pools').then(res =>
        res.data.incentivized_pools.filter(ip => ip.pool_id == poolId)
    )
    const mintParams = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/params').then(res => res.data.params)
    const epochs = await axios.get('https://lcd-osmosis.keplr.app/osmosis/epochs/v1beta1/epochs').then(res => res.data.epochs)
    const epochProvision = await axios.get('https://lcd-osmosis.keplr.app/osmosis/mint/v1beta1/epoch_provisions').then(res => res.data.epoch_provisions)
    
    // lockable durations: https://lcd-osmosis.keplr.app/osmosis/pool-incentives/v1beta1/lockable_durations
    const rewardApr1day = computeLpRewardsApr('86400s')
    const rewardApr7days = computeLpRewardsApr('604800s') + rewardApr1day
    const rewardApr14days = computeLpRewardsApr('1209600s') + rewardApr7days

    // compute OSMO staking rewards APR
    const osmoStakingRewardsApr = computeStakingApr()

    return {
        osmoStakingRewardsApr: osmoStakingRewardsApr,
        osmoStakingRewardsAprPct: (100.0*osmoStakingRewardsApr).toFixed(2) + '%',
        atomOsmoLpTokenTotalValueLockedUsd: poolTotalValueLocked,
        atomOsmoLpTokenPrice: lpTokenPrice,
        atomOsmoLpTokenReward14DaysBondedApr: rewardApr14days,
        atomOsmoLpTokenReward14DaysBondedAprPct: (100.0*rewardApr14days).toFixed(2) + '%'
    }

    function computeLpRewardsApr(duration) {
        const gaugeId = incentivizedPools.filter(ip => ip.lockable_duration == duration)[0].gauge_id
        const potWeight = distrInfo.records.filter(r => r.gauge_id == gaugeId)[0].weight

        const mintPrice = osmoPrice
        const epochIdentifier = mintParams.epoch_identifier

        const epoch = epochs.filter(e => e.identifier == epochIdentifier)[0]
        const epochDuration = dayjs.duration(parseInt(epoch.duration.replace('s', '')) * 1000)

        const numEpochsPerYear = dayjs.duration({ years: 1, }).asMilliseconds() / epochDuration.asMilliseconds()

        const yearProvision = epochProvision * numEpochsPerYear
        const yearProvisionToPots = yearProvision * mintParams.distribution_proportions.pool_incentives
        const yearProvisionToPot = yearProvisionToPots * (potWeight / totalWeight)
        const yearProvisionToPotPrice = mintPrice * yearProvisionToPot / 10 ** 6

        return yearProvisionToPotPrice / poolTotalValueLocked
    }

    function computeStakingApr() {
        const numEpochsPerYear = 365
        const yearProvision = epochProvision * numEpochsPerYear
        const yearProvisionToPot = yearProvision * mintParams.distribution_proportions.staking / 10.0 ** 6
        return yearProvisionToPot / osmoSupply
    }
}

exports.collect_osmosis = collect_osmosis